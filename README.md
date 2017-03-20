# QUIVER
Welcome to our documentation! Quiver is an platform that will allow artists and venue owners to communicate in a direct fashion -- owners can display their audio specs so that artists and bands have a better understanding of how they should prepare accordingly with their gear in order for the customers and audience to have the best experience possible.

So you guys want to enter an empathetic musical realm with some venues and jams eh?

DOPE.

#### PROBLEM DOMAIN:
As a performing artist, a very frustrating problem can often occur. When preparing for a performance at a new venue, it can be very difficult to find out exactly what kind of gear/PA is available for use. For a band that has a very specific sound to create, they need to know what equipment is available, and what equipment they should bring.


#### BUILD:
Using NodeJS/Express/MongoDB, created an API that will serve a front-end application that allows Bars and Venues to create a profile that will display their house PA. Each ‘venue’ model will have its own correlating ‘setup’ model that houses all their listed gear. Venues will have the option of modifying and adding gear at any time. Users (artists) can view the listed gear in preparation for a show.

Please, enjoy yourself and play around around with our APIs as you would like, we have left everything as open source in order for all to enjoy and benefit from.

All that is required is to install a list of packages, which can be done by simply copying in these successive commands in your terminal window that contains our repo that you have cloned down.

```js
npm i
```

## OUR MODELS

#### User
POST:
```/api/signup```
GET:
```/api/signin```
PUT:
```/api/user```
DELETE:
```/api/user```

#### Venue
Would you like to join our community as a new venue? POST to this url endpoint:
```/api/venue/```
Would you like to GET the information for a specific venue? This is the endpoint for you:
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

##### Setup
POST:
```/api/venue/:venueID/setup```
GET:
```/api/venue/:venueID/setup/:setupID```
PUT:
```/api/venue/:venueID/setup/:setupID```
DELETE:
```/api/venue/:venueID/setup/:setupID```

#### Pic
POST::
```/api/venue/:venueID/pic```

#### SO WHO ARE WE?
Shiv: Shiv is a software engineer and business consultant with an expertise in starts ups that is on the journey to find the intersection point between technology, art, and logic to create everlasting progressive changes and inspiration.
Nikko: I’m a full-stack Javascript developer with a passion for technologies that  communicate. I build dynamic platforms for producers to reach their markets. With over 10 years in service-industry experience and management, I bring a consumer-based focus to development. (Also, to have a little fun with it).
Will: A Full stack Javascript developer and who enjoys using new technology to find the creative and elegant solutions.


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
