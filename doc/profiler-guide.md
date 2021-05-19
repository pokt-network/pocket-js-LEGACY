# Profiler Guide

### What it is?
Is a new functionality that allows the developer to create metrics for any code block on the pocket-js library, the information being collected is ```block_key``` and ```time_ellapse``` of every code block inside the function.

### How does the Profiler works?
We have a `BaseProfiler` abstract class from which you can implement your own and implement a function called `flushResults` which receives a `data: any`,  `functionName: string` and `results: ProfileResult[]`.

On the `flushResults` function you should add how you want to manage the results, like store it to a DB, print it, etc.

You can pass as an argument to the `Pocket` class constructor with your implementation of the `BaseProfiler`, if an implementation is not passed it will defaults to a `NoOpProfiler` empty profiler.

**An implementation of the metrics can be seeing on `sendRelay`.**

### Prerequisites:
1- Create your `BaseProfiler` class implementation, you can use the `NoOpProfiler`**(path src/utils/no-op-profiler.ts)** as an example, remember to add your own implementation of `flushResults`.

### Usage example:
1- Instantiate `Pocket` with your `CustomBaseProfiler`.

2- On the first line of the desired **function** to profile, add:
    ```const profileResults: ProfileResult[] = []```
    ```const functionName = "send_relay"```
    **Explanation**: Here we create an array that will hold the `ProfileResults` and
    we name the main function we are profiling.

3- Before the **child function** that you want to profile, add:
    ```let profileResult = new ProfileResult("get_current_session")```
    **Explanation**: We create a new ProfileResult object that receives the sub-function name.

4- After the **child function** add:
    ```profileResult.save()```
    ```profileResults.push(profileResult)```
    **Explanation**: We save the `profileResult` and we add it to the `profileResults` array.

5- At the end of the main function add:
    ```await this.profiler.flushResults(data, functionName, profileResults)```

