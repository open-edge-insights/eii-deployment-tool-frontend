**Contents**

# Running Deployment tool front end

## Prerequisites
    
   Please ensure that all the pre-requisites needed for EII are installed. Please refer to [EII README](https://github.com/open-edge-insights/eii-core/blob/master/README.md) for more details.

## Configuration

  * The frontend server will run on the port defined at the env variable PORT in docker-compose.yml

## Running the tool

  * **Steps to run the tool**

    * **To simply run the container (without building)**:

      ```shell
      $ cd [WORKDIR]/IEdgeInsights/DeploymentToolFrontend
      $ ./run.sh
      ```

    * **To build and run**:
      ```shell
      $ ./run.sh --build
      ```
       or
      ```shell
      $ ./run.sh -b
      ```

      To build & run with --no-cache or to provide any other build argument, just append the same after the above commands.

      for e.g. 

      ```shell
      $ ./run.sh --build --no-cache
      ```

    * **To restart the container:**

      ```shell
      $ ./run.sh --restart
      ```
       or
      ```shell
      $ ./run.sh -r
      ```

    * **To bring down the container:**

      ```shell
      $ ./run.sh --down
      ```
       or
      ```shell
      $ ./run.sh -d
      ```
      

