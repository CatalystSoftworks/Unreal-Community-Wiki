/**
 * The supported versions of Unreal Engine that can be used for filtering content on the website.
 *
 * Initially these were stored in the database and had a UI for editing them. However, they are not updated
 * often by Epic and it's just easier (and more performant!) to hard them into the site itself and update the
 * wiki via CI/CD rather than support a whole new feature set.
 */
export const VERSIONS = [
    { number: 4.0, releaseDate: new Date("03/19/2014") },
    { number: 4.01, releaseDate: new Date("04/24/2014") },
    { number: 4.02, releaseDate: new Date("06/04/2014") },
    { number: 4.03, releaseDate: new Date("07/16/2014") },
    { number: 4.04, releaseDate: new Date("08/14/2014") },
    { number: 4.05, releaseDate: new Date("10/14/2014") },
    { number: 4.06, releaseDate: new Date("12/03/2014") },
    { number: 4.07, releaseDate: new Date("02/24/2015") },
    { number: 4.08, releaseDate: new Date("06/10/2015") },
    { number: 4.09, releaseDate: new Date("08/31/2015") },
    { number: 4.10, releaseDate: new Date("11/11/2015") },
    { number: 4.11, releaseDate: new Date("03/31/2016") },
    { number: 4.12, releaseDate: new Date("06/01/2016") },
    { number: 4.13, releaseDate: new Date("09/01/2016") },
    { number: 4.14, releaseDate: new Date("11/15/2016") },
    { number: 4.15, releaseDate: new Date("02/15/2017") },
    { number: 4.16, releaseDate: new Date("05/24/2017") },
    { number: 4.17, releaseDate: new Date("08/07/2017") },
    { number: 4.18, releaseDate: new Date("10/23/2017") },
    { number: 4.19, releaseDate: new Date("03/14/2018") },
    { number: 4.20, releaseDate: new Date("07/16/2018") },
    { number: 4.21, releaseDate: new Date("11/07/2018") },
    { number: 4.22, releaseDate: new Date("04/02/2019") },
    { number: 4.23, releaseDate: new Date("09/04/2019") },
    { number: 4.24, releaseDate: new Date("12/09/2019") },
    { number: 4.25, releaseDate: new Date("05/05/2020") },
    { number: 4.26, releaseDate: new Date("12/03/2020") },
    { number: 4.27, releaseDate: new Date("06/22/2021") },
    { number: 5.0, releaseDate: new Date("05/26/2021") },
    { number: 5.01, releaseDate: new Date("11/15/2022") },
    { number: 5.02, releaseDate: new Date("05/11/2023") },
    { number: 5.03, releaseDate: new Date("09/06/2023") },
].reverse();

/**
 * The most recent, STABLE version of Unreal Engine. This is the version used when setting preferred version
 * to "latest".
 */
export const LATEST_VERSION = VERSIONS[0].number;
