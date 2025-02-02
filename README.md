[![ReadMeSupportPalestine](https://raw.githubusercontent.com/Safouene1/support-palestine-banner/master/banner-support.svg)](https://github.com/Safouene1/support-palestine-banner)

![FROM THE RIVER TO THE SEA, PALESTINE WILL BE FREE](https://img.shields.io/badge/%F0%9F%87%B5%F0%9F%87%B8_FROM_THE_RIVER_TO_THE_SEA,_PALESTINE_WILL_BE_FREE-techforpalestine.org-000?labelColor=grey&color=D83838&link=https%3A%2F%2Ftechforpalestine.org%2Flearn-more)

# HADITH HUB (حديث حب)

With the name of Allah, the All-Merciful, the Very-Merciful.

All praise and thanks are due to Allah, the Master and King of existence, the All-Merciful, Beneficent, who has power over all things. May peace and blessings be upon His final Messenger, Sayyidina Muhammad ﷺ, and his Family, and his Companions.
About

HadithHub.com started in October 2022. It aims to make it easy for anyone to read, study, and learn the ahadith of Sayyidina Rasulullah ﷺ. This project is open source.

This repo is the frontend of the hadithhub.com, the data is in the [hadith-api](https://github.com/GibreelAbdullah/hadith-api) repo. We will be grateful if you contribute in this project to make it better.

It would be a grave injustice to omit the mention of [Fawaz Ahmed](https://github.com/fawazahmed0) who made the enormous effort in collecting Ahadith in multiple languages and their gradings by multiple scholars. This project wouldn't be possible without his efforts. May Allah ﷻ reward him immensely.

## Credits
[Fawaz Ahmed](https://github.com/fawazahmed0) : For collecting all the [Ahadith data](https://github.com/fawazahmed0/hadith-api). A complete list of sources of the data can be found [here](https://github.com/fawazahmed0/hadith-api/blob/1/References.md).

[Contributors - UI](https://github.com/GibreelAbdullah/HadithHub/graphs/contributors) : Contributors who helped in creating the website.

[Contributors - Data](https://github.com/GibreelAbdullah/hadith-api/graphs/contributors) : Contributors who helped in collecting hadith/gradings or correcting them.

[Svelte](https://svelte.dev/) : A front-end, open-source JavaScript framework for making interactive webpages.

[Skeleton](https://www.skeleton.dev/) : A fully featured UI Toolkit for svelte.

[html-to-image](https://github.com/bubkoo/html-to-image/) : A javascript library to convert html to image, essentially allowing us to download screenshots of Ahadith.

## Prerequisites

```npm``` should be installed in the system.

<hr>

## Contribution Guide

There are 3 repositories of interest.

1. [Hadith Hub](https://github.com/GibreelAbdullah/Hadith-Hub) (This Repo) - It is the frontend of the application written in Svelte.

2. [hadith-api](https://github.com/GibreelAbdullah/hadith-api) Branch name '2' - It holds all the data. All the json files in the repo act as APIs and the raw files are are served to the website whenever requested.
    
3. [hadith-search-api](https://github.com/GibreelAbdullah/hadith-search-api) - For the search functionailty, this is deployed to a server. Currently rethinking this implementation to make it more robust and cost effective. 

You may raise a PR, give suggestions, raise issues for any of them. 

<hr>

## To run the project

1. Clone the reposiory.

2. run ```npm install``` to install dependencies

3. run ```npm run dev``` to run the application in dev mode.

4. Goto ```http://localhost:5173``` in your browser.

