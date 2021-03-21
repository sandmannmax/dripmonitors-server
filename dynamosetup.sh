#!/bin/bash

aws dynamodb create-table --table-name lsb.monitorpageconfigs --attribute-definitions AttributeName=id,AttributeType=S --key-schema AttributeName=id,KeyType=HASH --endpoint-url http://localhost:7999 --provisioned-throughput ReadCapacityUnits=10,WriteCapacityUnits=5

aws dynamodb create-table --table-name lsb.monitorpages --attribute-definitions AttributeName=id,AttributeType=S --key-schema AttributeName=id,KeyType=HASH --endpoint-url http://localhost:7999 --provisioned-throughput ReadCapacityUnits=10,WriteCapacityUnits=5

aws dynamodb create-table --table-name lsb.monitorruns --attribute-definitions AttributeName=id,AttributeType=S --key-schema AttributeName=id,KeyType=HASH --endpoint-url http://localhost:7999 --provisioned-throughput ReadCapacityUnits=10,WriteCapacityUnits=5

aws dynamodb create-table --table-name lsb.monitors --attribute-definitions AttributeName=id,AttributeType=S --key-schema AttributeName=id,KeyType=HASH --endpoint-url http://localhost:7999 --provisioned-throughput ReadCapacityUnits=10,WriteCapacityUnits=5

aws dynamodb create-table --table-name lsb.monitorsources --attribute-definitions AttributeName=id,AttributeType=S --key-schema AttributeName=id,KeyType=HASH --endpoint-url http://localhost:7999 --provisioned-throughput ReadCapacityUnits=10,WriteCapacityUnits=5

aws dynamodb create-table --table-name lsb.pipeelements --attribute-definitions AttributeName=id,AttributeType=S --key-schema AttributeName=id,KeyType=HASH --endpoint-url http://localhost:7999 --provisioned-throughput ReadCapacityUnits=10,WriteCapacityUnits=5

aws dynamodb create-table --table-name lsb.processconfigs --attribute-definitions AttributeName=id,AttributeType=S --key-schema AttributeName=id,KeyType=HASH --endpoint-url http://localhost:7999 --provisioned-throughput ReadCapacityUnits=10,WriteCapacityUnits=5

aws dynamodb create-table --table-name lsb.products --attribute-definitions AttributeName=id,AttributeType=S --key-schema AttributeName=id,KeyType=HASH --endpoint-url http://localhost:7999 --provisioned-throughput ReadCapacityUnits=10,WriteCapacityUnits=5

aws dynamodb create-table --table-name lsb.proxies --attribute-definitions AttributeName=id,AttributeType=S --key-schema AttributeName=id,KeyType=HASH --endpoint-url http://localhost:7999 --provisioned-throughput ReadCapacityUnits=10,WriteCapacityUnits=5

aws dynamodb create-table --table-name lsb.proxy_cooldowns --attribute-definitions AttributeName=proxyId,AttributeType=S AttributeName=monitorpageId,AttributeType=S --key-schema AttributeName=proxyId,KeyType=HASH AttributeName=monitorpageId,KeyType=RANGE --endpoint-url http://localhost:7999 --provisioned-throughput ReadCapacityUnits=10,WriteCapacityUnits=5

aws dynamodb create-table --table-name lsb.urlelements --attribute-definitions AttributeName=id,AttributeType=S --key-schema AttributeName=id,KeyType=HASH --endpoint-url http://localhost:7999 --provisioned-throughput ReadCapacityUnits=10,WriteCapacityUnits=5

aws dynamodb update-table --table-name lsb.monitors --attribute-definitions AttributeName=userId,AttributeType=S --global-secondary-index-updates "[{\"Create\":{\"IndexName\":\"userId-index\",\"KeySchema\":[{\"AttributeName\":\"userId\",\"KeyType\":\"HASH\"}], \"ProvisionedThroughput\": {\"ReadCapacityUnits\": 10, \"WriteCapacityUnits\": 5      },\"Projection\":{\"ProjectionType\":\"ALL\"}}}]" --endpoint-url http://localhost:7999

aws dynamodb update-table --table-name lsb.monitorsources --attribute-definitions AttributeName=monitorId,AttributeType=S --global-secondary-index-updates "[{\"Create\":{\"IndexName\":\"monitorId-index\",\"KeySchema\":[{\"AttributeName\":\"monitorId\",\"KeyType\":\"HASH\"}], \"ProvisionedThroughput\": {\"ReadCapacityUnits\": 10, \"WriteCapacityUnits\": 5      },\"Projection\":{\"ProjectionType\":\"ALL\"}}}]" --endpoint-url http://localhost:7999

aws dynamodb update-table --table-name lsb.pipeelements --attribute-definitions AttributeName=processconfigId,AttributeType=S --global-secondary-index-updates "[{\"Create\":{\"IndexName\":\"processconfigId-index\",\"KeySchema\":[{\"AttributeName\":\"processconfigId\",\"KeyType\":\"HASH\"}], \"ProvisionedThroughput\": {\"ReadCapacityUnits\": 10, \"WriteCapacityUnits\": 5      },\"Projection\":{\"ProjectionType\":\"ALL\"}}}]" --endpoint-url http://localhost:7999

aws dynamodb update-table --table-name lsb.processconfigs --attribute-definitions AttributeName=monitorpageconfigId,AttributeType=S --global-secondary-index-updates "[{\"Create\":{\"IndexName\":\"monitorpageconfigId-index\",\"KeySchema\":[{\"AttributeName\":\"monitorpageconfigId\",\"KeyType\":\"HASH\"}], \"ProvisionedThroughput\": {\"ReadCapacityUnits\": 10, \"WriteCapacityUnits\": 5      },\"Projection\":{\"ProjectionType\":\"ALL\"}}}]" --endpoint-url http://localhost:7999

aws dynamodb update-table --table-name lsb.proxies --attribute-definitions AttributeName=address,AttributeType=S --global-secondary-index-updates "[{\"Create\":{\"IndexName\":\"address-index\",\"KeySchema\":[{\"AttributeName\":\"address\",\"KeyType\":\"HASH\"}], \"ProvisionedThroughput\": {\"ReadCapacityUnits\": 10, \"WriteCapacityUnits\": 5      },\"Projection\":{\"ProjectionType\":\"ALL\"}}}]" --endpoint-url http://localhost:7999

aws dynamodb update-table --table-name lsb.proxy_cooldowns --attribute-definitions AttributeName=monitorpageId,AttributeType=S --global-secondary-index-updates "[{\"Create\":{\"IndexName\":\"monitorpageId-index\",\"KeySchema\":[{\"AttributeName\":\"monitorpageId\",\"KeyType\":\"HASH\"}], \"ProvisionedThroughput\": {\"ReadCapacityUnits\": 10, \"WriteCapacityUnits\": 5      },\"Projection\":{\"ProjectionType\":\"ALL\"}}}]" --endpoint-url http://localhost:7999

aws dynamodb update-table --table-name lsb.urlelements --attribute-definitions AttributeName=monitorpageId,AttributeType=S --global-secondary-index-updates "[{\"Create\":{\"IndexName\":\"monitorpageId-index\",\"KeySchema\":[{\"AttributeName\":\"monitorpageId\",\"KeyType\":\"HASH\"}], \"ProvisionedThroughput\": {\"ReadCapacityUnits\": 10, \"WriteCapacityUnits\": 5      },\"Projection\":{\"ProjectionType\":\"ALL\"}}}]" --endpoint-url http://localhost:7999