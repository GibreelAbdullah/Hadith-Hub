# WORK PROGRESS

## For implementing the search functionality

1. With current implementation of using the json files directly from github made it difficult to add a search functionality, since the data is not present in a singular location.

2. Thought of using a third party search engine, there were plenty of options available like typesence, elastisearch, algolia, meilisearch etc. After weighing pros and cons setteled with meilisearch.

3. Set everything up in local, now wanted to deploy it to Google cloud functions. Worked perfectly until the data suddenly vanished. No idea why.

4. Looked for a free alternative service to deploy the container. Meilisearch lists Koyeb on their website with a easy once click deploy. YAY. Deploy, doesn't work, redeploy - doesn't work, redeploy - doesn't work. Redeploy -Take a break and come back, works. Turns out the service needs a few minutes to actually reflect.

5. Run a job to add all the hadith data, instance crashes all the data is lost. Run again same thing again. Thougth if I add data in batches maybe it will not crash. Run again with sleep for 5 min after each book. Crashes again, try few more times, same result. Give up.

6. Go back to Google cloud functions. Do some reading. Turns out that serverless means that there is only a temporary storage available and once the instance shuts/crashes the data will be lost. Great learning experience but a lot of time wasted.

7. Spent a lot of time figuring out how to proceed next, finally it clicked. I should add all the data in the docker container that is being pushed to cloud functions. Problem is I didn't know docker.

8. Found a exact usecase in an obscure site on how to push a meilisearch docker instance with data. But it did not work, since meilisearch has moved the data directory to a new location in a new release. Debugged for a long time and finally got it to work. YAY.jpg

9. Pushed to Google Cloud Functions. Didn't work. Ran the container in local works perfectly. MFW I don't know what to do.

10. Retried the same thing half a dozen times over the course of 2 days in hope it will work. Still doesn't work and no error at GCP.

11. Return back to Koyeb and tried to deploy the entire container there. Doesn't work. Give up again.

12. MFW the error message is at the main screen of the function page and not in the logs.

13. Memory issue. Easy peasy, increase the memory from 512MB to 1GB.

14. Memory issue. Easy peasy, increase the memory from 1GB to 2GB.

15. Memory issue. Easy peasy, increase the memory from 2GB to 4GB.

16. MFW the container size is 7.2 GB. To expensive.

17. Think of alternatives. Apache Solr looks promising as well as SQLITE with FTS5.

18. Decide to go ahead with Sqlite. Add all the data in local instance, works well. Size is 450MB compared to 7.2GB for meilisearch.

19. Now to embed the sqlite in JAR to be deployed in GCP Functions. Turns out it is a pain to embed.

20. Someone on stackoverflow suggests Apache derby.