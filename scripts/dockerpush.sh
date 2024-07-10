#!/bin/bash
increment=.01
cd /home/ec2-user/tmp/dev-pdap-ui-v2/
version=$(cat /home/ec2-user/tmp/dev-pdap-ui-v2/version.txt)
cmd1="aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 013278550016.dkr.ecr.us-east-1.amazonaws.com"
cmd2="docker push 013278550016.dkr.ecr.us-east-1.amazonaws.com/doctustech/pdap-ui-v2:$version"
cmd3="docker push 013278550016.dkr.ecr.us-east-1.amazonaws.com/doctustech/pdap-ui-v2:dev"
eval $cmd1
eval $cmd2
eval $cmd3
updatever=$(echo "$version + $increment"|bc)
cmd4="echo $updatever > /home/ec2-user/tmp/dev-pdap-ui-v2/version.txt"
echo $updatever
eval $cmd4
exit

