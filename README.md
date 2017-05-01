# QUIVER
Quiver is a platform that will allow artists and venue owners to communicate in a direct fashion. Venue owners can display their audio specs so that artists and bands have a better understanding of how they should prepare for an upcoming gig.

#### PROBLEM DOMAIN:
As a performing artist, a very frustrating problem can often occur. When preparing for a performance at a new venue, it can be very difficult to find out exactly what kind of gear/PA is available for use. For a band that has a very specific sound to create, they need to know what equipment is available, and what equipment they should bring.


#### BUILD:
Using NodeJS/Express/MongoDB, created an API that will serve a front-end application that allows Bars and Venues to create a profile that will display their house PA. Each ‘venue’ model will have its own correlating ‘gear’ model that houses all their listed gear. Venues will have the option of modifying and adding gear at any time. Users (artists) can view the listed gear in preparation for a show.

To get started, simply use this command in your Terminal:

```js
npm i
```

## OUR MODELS

#### User
POST:
```/api/signup```
GET:
```/api/login```
PUT:
```/api/user```
DELETE:
```/api/user```

#### Venue
Would you like to join our community as a new venue? POST to this url
endpoint:

```/api/venue/```

Would you like to GET the information for a specific venue? This is the
endpoint for you:

```api/venue/:id```

Need to update any information? PUT to this point:

```api/venue/:id```

No longer jamming at a venue? DELETE here:

```api/venue/:id```


##### Artist
POST:
```/api/artist/```
GET:
```api/artist/:id```
PUT:
```api/artist/:id```
DELETE:
```api/artist/:id```

##### Gear
POST:
```/api/venue/:venueID/gear```
GET:
```/api/venue/:venueID/gear/:gearID```
PUT:
```/api/venue/:venueID/gear/:gearID```
DELETE:
```/api/venue/:venueID/gear/:gearID```

#### Pic
POST::
```/api/venue/:venueID/pic```

#### SO WHO ARE WE?

Shiv: Shiv is a software engineer and business consultant with an expertise in start-ups that is on the journey to find the intersection point between technology, art, and logic to create everlasting progressive changes and inspiration.

Nikko: As a software engineer, I bring simple and creative solutions that are widely accessible to the user. The deliverables I create are well-scrutinized, well-tested, and fit the need. I design dynamic applications that stem from a shared vision - a vision that is produced by a team. (Also, to have a little fun with it).

Will: A Full-stack Javascript developer who enjoys using new technology to find the most creative and elegant solutions.


#### Built Using:
-"Express" - (expressjs.com)

-"JsonWebToken" - (https://www.npmjs.com/package/json-web-token)

-"Morgan" - (https://github.com/expressjs/morgan)

-"Debug" - (https://github.com/visionmedia/debug)

-"HTTP-Errors" - (Native Node Module)

-"Body-Parser" - (Native Node Module)

-"Cors" - (https://www.npmjs.com/package/cors)

-"Del" - (https://www.npmjs.com/package/del)

-"Bcrypt" - (https://www.npmjs.com/package/bcrypt-nodejs)

-"Crypto" - (Native Node Module)

-"HTTPie' - (https://httpie.org)

-"Bluebird" - (http://bluebirdjs.com/)
