**Contents**

* Running Deployment tool frontend

  * The frontend server will run on the port defined at the env variable PORT in docker-compose.yml
  * As of now, the tool will run development server, not a production one. 
    ```
    cd IEdgeInsight/deployment-tool-backend
    ./run.sh
    ```
    * To build and run:
      ```
      ./run.sh --build
      ```

       or
      ```
      ./run.sh -b
      ```
    * To build & run with --no-cache or to provide any other build argument, just append the same after the above commands
    * for e.g.
      ```
      ./run.sh --build --no-cache
      ```  

