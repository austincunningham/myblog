# Git log pretty print aliases

![](https://thepracticaldev.s3.amazonaws.com/i/qobu36gh1f44gtuunqzs.png)

A couple of git aliases for git log pretty print. Add them to your `.zshrc` or `.bashrc` for usage and source the file e.g.`source ~/.zshrc`, or restart your terminal for the changes to apply. 

## gitp - pretty print the last 10 logs
```bash
#Print latest 10 submit logs
alias gitp="git log --pretty=format:'%C(yellow)%h %Cred%ad  %Creset%s' --date=local --max-count=10"
# Usage
gitp
```
![Alt Text](https://thepracticaldev.s3.amazonaws.com/i/d0tgjd85r31mh8p89rtv.png)

## gitpp - pretty print all logs
```bash
#Print latest all submit logs
alias gitpp="git log --pretty=format:'%C(yellow)%h %Cred%ad  %Creset%s' --date=local"
#Usage
gitpp
```
Output the same as gitp but not limited to 10 commits


## gitpa - pretty print include author
```bash
# Include author
alias gitpa="git log --pretty=format:'%C(yellow)%h %<(24)%C(red)%ad %<(18)%C(green)%an %C(reset)%s' --date=local --max-count=10"
# Usage
gitpa
```
![Alt Text](https://thepracticaldev.s3.amazonaws.com/i/7he5z1h2n4voe1z1bugu.png)

## gitag - pretty print tags
```bash
#Print log information on tags
alias gitag="git log --no-walk --tags --pretty=format:' %C(yellow)%h %Cgreen%d  %Cred%ad  %Creset%s' --date=local"
# Usage
gitag
```
![Alt Text](https://thepracticaldev.s3.amazonaws.com/i/pshrd4qjpi44zkinngjp.png)

## gitbr - Provide minimal graphical display
```bash
#Provide minimal graphical display
alias gitbr='git log --oneline --decorate --graph --all'
# Usage
gitbr
```
![Alt Text](https://thepracticaldev.s3.amazonaws.com/i/buf949osyujf6v3kfqqp.png)

Used gitbr a lot in the passed but now use [tig](https://jonas.github.io/tig/) which does the same and more

![Alt Text](https://thepracticaldev.s3.amazonaws.com/i/11rlynqzh9nhigr8n9me.png)

Credit for these alias goes to https://github.com/usplitu