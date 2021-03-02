buf generate
python3 -m grpc_tools.protoc -I. --grpc_python_out=build/python scraper/v1/scraper.proto
python3 -m grpc_tools.protoc -I. --grpc_python_out=build/python proxy/v1/proxy.proto