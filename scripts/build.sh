#!/bin/bash
cd /home/ec2-user/tmp/dev-pdap-ui-v2
pwd
version=$(cat /home/ec2-user/tmp/dev-pdap-ui-v2/version.txt)
echo $version
cmd1="sudo docker build . -t 013278550016.dkr.ecr.us-east-1.amazonaws.com/doctustech/pdap-ui-v2:$version -t 013278550016.dkr.ecr.us-east-1.amazonaws.com/doctustech/pdap-ui-v2:dev"
echo $cmd1
eval $cmd1
exit
