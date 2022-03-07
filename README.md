**Contents**

# Running Deployment tool front end

## Prerequisites

> - Please ensure that all the pre-requisites needed for EII are installed. Please refer to [EII README](https://github.com/open-edge-insights/eii-core/blob/master/README.md) for more details.
> - Please follow [pre-requisites for video accelerators](https://github.com/open-edge-insights/eii-core#using-video-accelerators-in-ingestionanalytics-containers) and [pre-requisities for cameras](https://github.com/open-edge-insights/video-ingestion#camera-configuration) before trying to change the config through the deployment tool front end

## Configuration

  * The frontend server will run on the port defined at the env variable PORT in docker-compose.yml.
  * The frontend server will run in dev mode (http/insecure) or prod mode (https/secure) depending on the env variable 'dev_mode' in docker-compose.yml.
    By default prod mode is enabled.

    ```
    dev_mode: "false"
    ```

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

    * **Launching the UI:**

        To launch the UI, open your browser and navigate to http(s)://\<host-ip\>:\<host-port\>

        For e.g.
        ```
        https://127.0.0.1:3100
        ```
        when in prod mode, or
        ```
        http://127.0.0.1:3100
        ```
        when in dev mode.

        To login to the tool, use the credentials provided in the creds.json under DeploymentToolBackend repo. Please go through the README under this repo for more details.

## Using the tool

Once the ./run.sh is run, wait for 30 seconds or so for the frontend server to come up. If it's the first time you are running the tool, you might need to wait several minutes. To know whether the frontend has actually come up you may check the logs in *deployment_tool_frontend* container using the following command:

```shell
$ docker logs -f deployment_tool_frontend
```
When the log shows *"Starting the development server..."*, you may launch the browser and type in the url as mentioned in the above sections.
Please note that currently only Chrome browser is supported. Although it would work on other browsers, you might encounter some issues.

Once you type in the url in the browser, a splash screen appears followed by the login screen.

### Login screen

Please provide the same credentials which are configured in the backend *creds.json* file.
Also, ensure that both frontend and backend are running in the same mode (*dev/prod*). By default, both are configured to run in *prod* mode.
Once the user successfully login to the tool, Project screen appears.

### Project screen

User can either create a new project or choose an existing one.
When creating a new project user should specify the number of data streams/instances he/she wants to create. 
On clicking *Next* button, Configure screen appears.

### Configure screen

Here, the user selected/created use case layout is shown.
Please note that, by default use cases are created in VI-VA pair, for each stream/instance. User can add more streams by dragging and dropping either VI or VA from the component list in the left pane, to the component layout area. Please note that, in this case as well, the new stream added as a VI-VA pair.
The behavior is same when the user removes a VI/VA component. To remove a component, click to select it and then press the 'DEL' key on the keyboard.
If the user only wants VI (and not VA) in the use case, user can remove all the VI/VA streams from the component layout, and then drag and drop VI component from the left pane. However, the VI only use case is not fully supported by the tool as of now.
Also note that, in the current version, when the user deletes a stream, only the last stream gets deleted, irrespective of the stream user has selected. This is due to a limitation in the platform.

User can modify the component settings in Config screen and appears in the right pane (labelled as Settings) when the user clicks to select it. After making modifications, user must click the *Save* button to save the changes.

You may configure the VI to use camera as *ingestor*. Camera settings can be adjusted in the *Test* screen on the fly to optimize the output preview. Please note that as of now, camera adjustment is supported only for USB cameras. Also, in case of other cameras, any additional configuration for that device to work, need to be manually done on the platform.

User can also add UDFs to the config, either by modifying the component config, or by using 'Import UDF' feature. When user clicks 'Import UDF' button, a file selection dialog appears where it lists the existing UDFs. User can browse through the files/folders to select the desired UDF and then click 'Select' button to add the UDF to the config. The list of UDFs currently added to the component appears on the component itself in the layout area.
If the user wants to import new UDF (which doesn't exist in the common/video/udfs folder), he/she needs to manually copy it to the above folder. Please note that as of now, only Python UDFs are supported to import via Import UDF functionality.

Once the user has done with all configurations, he/she needs to build the containers to run and test the use case. So, user needs to click the 'Start' button in the bottom pane under *Build* section to start the build. The progress of the build is indicated by the progress bar. User can also view the build logs, by clicking *View Logs* button. Please note that currently there's no option to stop/cancel a build and hence the *Cancel* button would be always inactive.
Onc the build reaches 100%, *Next* button would be enabled, and user can click the same to navigate to *Test* screen. If the build fails for some reason, the *Start* button would be enabled again and user can re-try the build. He/she can check the build failure reason by checking the logs.

### Test screen

In test screen user can preview the output from VA for each stream, by clicking on it. When clicked on VI/VA corresponding UDF settings are also shown in the bottom pane. User may update these values in this screen itself and click 'Save & Restart' button to save the setting and restart the containers to view the updated output. 
If a USB camera is configured in VI, the camera controls are also shown, which the user can adjust on the fly to see the effect on the classified output preview. Please note that these camera control adjustments may not be fast enough, especially when you have low end machine.
user can also choose to navigate back to Configure screen, by click the *Back* button or navigate to *Project* screen to cancel the current project and choose another one, by clicking the *Cancel* button.
Once the user is satisfied with the classified output, he/she can navigate to deploy screen to deploy the use case locally and/or remotely, by clicking the *Next* button.

### Deploy screen

In deploy screen, user can deploy the use case locally and/or remotely. User needs to choose the desired deployment mode (dev or prod) and click *Deploy* button to deploy locally. 
To deploy in a remote machine, enter the details of the desired machine the fields under *Remote machine details* and click *Deploy in remote machine* button.
Please note that remote deployment can take considerable amount of time, depending on the size and number of the container images, and on network conditions. Also, in this version it just copies the images and *eii* build folder to the remote machine - It doesn't run the images over there.

Please note that, once the deployment is triggered or done, user cannot go back to the Test screen or Configure screen. user can either sign out by clicking the *Sign out* button on the top right corner, or he/she can navigate to the *Project selection* screen by clicking the *Cancel* button.

To bring up the containers in the remote machine, wait till the deployment is completed, login to remote machine and cd to the build directory under the directory which was specified while deploying.

Then run:

```shell
./source.sh
./eii_start.sh
```

## Notes

- When built and run on a fresh machine, it could take several minutes for the front end to come up.
- The current version of Web Deployment Tool doesn't fully support running backend and frontend containers in different machines.
- Currently only Chrome browser is supported
- Only python UDFs are allowed to import
- Camera configuration is supported only for USB cameras
- Additional configuration needed, if any for other camera devices, should be done manually
- The tool support a max of 6 streams/instances
