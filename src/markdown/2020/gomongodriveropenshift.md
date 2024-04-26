
# Golang Mongo driver and Openshift

![](https://dev-to-uploads.s3.amazonaws.com/i/kpkgjlzozjrryfbb2j4l.png)
 
I wanted to learn how to create a rest Api with Golang and MongoDb, found a lot of tutorials
using the [mgo](https://github.com/go-mgo/mgo) library but as this was unmainitained. I used the
[Mongo driver](https://www.mongodb.com/blog/post/mongodb-go-driver-tutorial) instead with 
[gorilla/mux](https://github.com/gorilla/mux). First set up package and imports.

```golang
package main

import (
	"fmt"
	"log"
	"net/http"
	"context"
	"encoding/json"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"github.com/gorilla/mux"
    "github.com/austincunningham/GolangUserRestApi/models"
)
```
Setup the routes and Mongo db connection
```golang
// setting a global DB struct to be accessible to route functions
type DB struct {
	collection *mongo.Collection
}

// Define the routes
func main() {
	fmt.Printf("REST API User from golang ")

	// Set client options
    clientOptions := options.Client().ApplyURI("mongodb://localhost:27017")

	// Connect to MongoDB
	client, err := mongo.Connect(context.TODO(), clientOptions)
	if err != nil {
		log.Fatal(err)
	}

	// Check the connection
	err = client.Ping(context.TODO(), nil)

	if err != nil {
		log.Fatal(err)
	}
	defer client.Disconnect(context.TODO())

	collection := client.Database("golang-user").Collection("users")
	db := &DB{collection: collection }
	

    
	fmt.Println("Connected to MongoDB!")

	//outputs
	fmt.Printf("Server listing on http://localhost:8080/users")
	fmt.Printf(" CTRL C to exit ")

	// Controller for endpoints
	r := mux.NewRouter()
	r.HandleFunc("/users", db.AllUsers).Methods("GET")
	r.HandleFunc("/users/{id}", db.FindUser).Methods("GET")
	r.HandleFunc("/users", db.CreateUser).Methods("POST")
	r.HandleFunc("/users/{id}", db.UpdateUser).Methods("PUT")
	r.HandleFunc("/users/{id}", db.DeleteUser).Methods("DELETE")

	if err := http.ListenAndServe(":8080", r); err != nil {
		log.Fatal(err)
	}
}
```
Setup the model package
```golang
package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// the properties in Mongodb document
type User struct {
	Id primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	Name string `bson:"name" json:"name"`
	Email string `bson:"email" json:"email"`
	Password string `bson:"password" json:"password"`
}
```
Back in the main package define the 

**GET** all users function
```golang
// find all users
func (db *DB)AllUsers(res http.ResponseWriter, req *http.Request){
	fmt.Println("AllUsers GET")
	// create an array of users
	var results []models.User
	var user models.User
	// set the api header
	res.Header().Set("content-type", "application/json")
	// set the find options, not sure I need this
	findOptions := options.Find()
	// use the find command to get all
	result , err := db.collection.Find(context.TODO(), bson.D{{}}, findOptions)
	if err != nil {
		fmt.Println("AllUsers GET failed to query DB", err)
	}
	//go through the result and decode each element at a time
	for result.Next(context.TODO()){
		err := result.Decode(&user)
        if err != nil {
            log.Fatal(err)
		}
		// add to the array
        results = append(results, user)
	}
	//return the array as json
	json.NewEncoder(res).Encode(results)
}
```
**GET** find user by id function
```golang
// find a single user
func (db *DB)FindUser(res http.ResponseWriter, req *http.Request){
	fmt.Println("FindUser GET")
	var user models.User
	params := mux.Vars(req)
	objectId, _ := primitive.ObjectIDFromHex(params["id"])
	res.Header().Set("content-type", "application/json")
	filter := bson.M{"_id": objectId}
	err := db.collection.FindOne(context.TODO(), filter).Decode(&user)
	if err != nil{
		fmt.Println("error",err)
	}
	json.NewEncoder(res).Encode(user)

}
```
**DELETE** user by id is pretty similar
```golang
func (db *DB)DeleteUser(res http.ResponseWriter, req *http.Request){
	fmt.Println("DeleteUser DELETE")
	params := mux.Vars(req)
	objectId, _ := primitive.ObjectIDFromHex(params["id"])
	res.Header().Set("content-type", "application/json")
	filter := bson.M{"_id": objectId}
	result, err := db.collection.DeleteOne(context.TODO(), filter)
	if err != nil{
		fmt.Println("DeleteUser DELETE failed to query DB",err)
	}
	json.NewEncoder(res).Encode(result)
}
```
**PUT** update user by id 
```golang
func (db *DB)UpdateUser(res http.ResponseWriter, req *http.Request){
	fmt.Println("UpdateUser PUT")
	var user models.User
	// get the id from the url
	params := mux.Vars(req)
	objectId, _ := primitive.ObjectIDFromHex(params["id"])
	// set the header info
	res.Header().Set("content-type", "application/json")
	//set the filter on the id
	filter := bson.M{"_id": objectId}
	// decode the request body 
	_ = json.NewDecoder(req.Body).Decode(&user)
	update := bson.M{"$set": &user}
	result,err := db.collection.UpdateOne(context.TODO(), filter, update)
	if err != nil{
		fmt.Println("UpdateOne PUT failed to query DB ",err)
	}
	json.NewEncoder(res).Encode(result)
}
```
**POST** create user
```golang
func (db *DB)CreateUser(res http.ResponseWriter, req *http.Request){
	fmt.Println("CreateUser POST")
    var user models.User
	res.Header().Set("content-type", "application/json")
	_ = json.NewDecoder(req.Body).Decode(&user)

	result, err := db.collection.InsertOne(context.TODO(), user)
	if err != nil {
		fmt.Println("CreateUser Error inserting record ", err)
	}
	json.NewEncoder(res).Encode(result)
}
```
So the rest api is all setup at this point to connect to my local MongoDb.

## Setup the container and deploy to Openshift
First I set up a project in Openshift 3.11, on [Minishift](https://www.okd.io/minishift/)
```bash
oc new-project golanguser
```
Login to the Openshift console and deploy Mongodb from the Openshift catalog. Open the project in the console and click on `Browse Catalog`

 ![Alt Text](https://dev-to-uploads.s3.amazonaws.com/i/6s87xgigwjp9t079qkav.png)

Click on Mongodb

![Alt Text](https://dev-to-uploads.s3.amazonaws.com/i/5wlte8gazfc8ltolqcpy.png)

Follow the creation flow until you get to `Configuration` set the following as some will be auto generated if you don't

`Database Service Name`

`MongoDB Connection Username`
  
`MongoDB Connection Password`
  
`MongoDB Database Name`
  
`MongoDB Admin Password`


Once set click the create button

![Alt Text](https://dev-to-uploads.s3.amazonaws.com/i/j0spux60fum5zr2l4sf6.png)

The Results screen will have the connection url. I will be using part of the connection url in the code.

![Alt Text](https://dev-to-uploads.s3.amazonaws.com/i/6uvw4xdgctqs0p6ypf44.png)

Change the connection url in the main package here
```golang
// Set client options
    clientOptions := options.Client().ApplyURI("mongodb://myadmin:password@mongodb:27017")
```
And make sure that your collection is pointing at the correct db
```golang
collection := client.Database("golanguser").Collection("users")
	db := &DB{collection: collection }
```
Once these are set we are ready to create the golang container with the following `dockerfile`
```bash
# Start from the latest golang base image
FROM golang:latest

# Set the Current Working Directory inside the container
WORKDIR /app

# Copy go mod and sum files
COPY go.mod go.sum ./

# Download all dependencies. Dependencies will be cached if the go.mod and go.sum files are not changed
RUN go mod download

# Copy the source from the current directory to the Working Directory inside the container
COPY . .

# Build the Go app
RUN go build -o main .

# Expose port 8080 to the outside world
EXPOSE 8080

# Command to run the executable
CMD ["./main"]
```
Build the image and push it to a remote registry
```bash
docker build -t austincunningham/golanguserrestapi:latest .
docker push austincunningham/golanguserrestapi:latest
```
You can then add the Image to project in the Openshift console `Add to Project/Deploy Image`

![Alt Text](https://dev-to-uploads.s3.amazonaws.com/i/kh8mr42iez0eig73v27n.png)

Enter the Image Name click the search icon and deploy when the image is found

![Alt Text](https://dev-to-uploads.s3.amazonaws.com/i/omij1c8m1mmtpnjojyw8.png)

Once the container is deployed you can test the connection between MongoDb and the rest api as follows

```bash
oc project golanguser
oc get pods
NAME                        READY     STATUS    RESTARTS   AGE
golanguserrestapi-1-7px9p   1/1       Running   1          14h
mongodb-1-s9fkd             1/1       Running   6          8d
# log into the pod
oc exec -it golanguserrestapi-1-7px9p bash
# curl and POST some data
curl --header "Content-Type: application/json"   --request POST   --data '{"name":"austin","email":"austin@austin.com","password":"password"}' http://localhost:8080/users
# successful response
{"InsertedID":"5ef7a5dba99a0cb3de9302dc"}
# curl the GET all endpoint
curl http://localhost:8080/users
[{"_id":"5ef77db74e369e5acbf07a12","name":"austin","email":"austin@austin.com","password":"password"}]

``` 
Final step is to add a route click on the rest container and `create route`

![Alt Text](https://dev-to-uploads.s3.amazonaws.com/i/e9asppukj1pp1zkbaat3.png)

Except the defaults your route will appear in the console it can be accessed from any where with the users route

![Alt Text](https://dev-to-uploads.s3.amazonaws.com/i/c50lg6v7qqqv87ayogg3.png)

Code lives [on github](https://github.com/austincunningham/GolangUserRestApi) and the container image [on dockerhub](https://hub.docker.com/repository/docker/austincunningham/golanguserrestapi)







