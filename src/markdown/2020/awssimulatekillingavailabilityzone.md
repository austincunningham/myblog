# AWS simulate killing an Availability Zone

![](https://dev-to-uploads.s3.amazonaws.com/i/1qhsppqsoflzcyq0ewe3.jpg)

At some stage in development of a high availability application you will want test what happens when an Availability Zone goes down in AWS. 

## Disabling AZ
Blocking all network traffic to AZ seems the best way to simulate this. The method I used was to change the ACL for all the subnets on an AZ to new ACL. The AWS cli creates ACL with Deny All traffic by default for new ACL's.
```bash
#!/bin/bash

# prereq
#  - jq
#  - aws-cli

AZ=eu-west-1c
# use the subnetId to get the NetworkAclAssociationId to create the new acl association
for SUBNETID in $(aws ec2 describe-subnets --region ${AZ%?}| jq ".Subnets[] | select(.AvailabilityZone==\"$AZ\")"  | jq -r '.SubnetId')
do
  aws ec2 describe-network-acls --region ${AZ%?}| jq -r ".[] | .[].Associations[] | select(.SubnetId==\"$SUBNETID\")" | jq -r '.NetworkAclAssociationId' >> NetworkAclAssociationId.tmp
  # Need to take a backup of the original NetworkAclId's to be able to reverse the change
  aws ec2 describe-network-acls --region ${AZ%?}| jq -r ".[] | .[].Associations[] | select(.SubnetId==\"$SUBNETID\")" | jq -r '.NetworkAclId' >> NetworkAclId-restore.tmp
done
```
As I have multiple VPC I needed to create a different ACL for each VPC .
```bash
# create the dummy ACL and create a file containing the NetworkAclId for the dummy ACL for each VPC
for VPCID in $(aws ec2 describe-subnets --region ${AZ%?} | jq -r ".Subnets[] | select(.AvailabilityZone==\"$AZ\")"  | jq -r '.VpcId')
do
  aws ec2 create-network-acl --vpc-id $VPCID --region ${AZ%?} | jq -r '.NetworkAcl.NetworkAclId' >> NetworkAclId.tmp
done
```

I then created a function that takes the lists of NetworkAclAssociationId and NetworkAclId and changes the ACL association
```bash
# Function ChangeAcl takes two arguments for disable or enable
# $1 should be NetworkAclAssociationId filename
# $2 should be NetworkAclId filename
function ChangeAcl() {
  # needed to read from two files so used a count to poll through the lines of the second file
  count=1
  cat $1 | while read NetworkAclAssociationId
  do
    echo $(sed -n "${count}p" < $2)
    echo $NetworkAclAssociationId
    aws ec2 replace-network-acl-association --region ${AZ%?} --association-id $NetworkAclAssociationId --network-acl-id $(sed -n "${count}p" < $2)
    ((count=count+1))
  done
}
# Call the function to create new disable ACL association
ChangeAcl NetworkAclAssociationId.tmp NetworkAclId.tmp
```
At this point I have disable all traffic to a particular AZ and now I can check if resources are redistributed as expected and there is no downtime.

## Re-enabling again
It takes a few extra steps to re-enable again
```bash
# Get the new networkAclAssociationId for the subnets
for SUBNETID in $(aws ec2 describe-subnets --region ${AZ%?} | jq ".Subnets[] | select(.AvailabilityZone==\"$AZ\")" | jq -r '.SubnetId')
do
  aws ec2 describe-network-acls --region ${AZ%?} | jq -r ".[] | .[].Associations[] | select(.SubnetId==\"$SUBNETID\")" | jq -r '.NetworkAclAssociationId' >> NetworkAclAssociationId-restore.tmp
done
# Restore the subnets to the original ACL's
ChangeAcl NetworkAclAssociationId-restore.tmp NetworkAclId-restore.tmp

# delete the dummy ACL's
cat NetworkAclId.tmp | while read deleteNetworkAclId
do
  aws ec2 delete-network-acl --network-acl-id $deleteNetworkAclId --region ${AZ%?}
done
```
That's it, all traffic should be restored to original configuration.