# QUIVER
Quiver is a web-based application that allows venue owners to list house-PA and audio specs. Venue owners can display and maintain their "gear" so that artists and bands have a better understanding of how they should prepare for an upcoming gig.


#### Overview:


To get started, first install the necessary packages to run locally:

```js
npm i
```

## OUR MODELS (schemas)

#### User

#### Venue

#### Gear


## Routes

#### User (authentication routes):
POST:

```/api/signup```

GET:

```/api/login```



#### Venue
Upon signup, a new venue is istantiated. I.e. a ```POST``` request is made. This creates a one-to-one relationship between venues and users.

POST:

```/api/venue/```

GET:

(fetch all)

This route allows for fetching all available venues - this is happening in our "venue-search" view for the frontend.

```/api/venue```

(fetch one)
This route facilitates two scenarios in our app. First, upon logging in to your account, our app automatically grabs your corresponding venue schema. Second, upon choosing a searched venue, the corresponding venue would be fetched to display on the "public dashboard."

```api/venue/:id```

PUT:

When updating your profile information, your route would ```PUT``` here:

```api/venue/:id```




#### Gear
POST:

Upon signup, a gear schema is automatically instantiated that is relational to a single venue. This creates a one-to-one relationship between our venues and gear.

```/api/venue/:venueID/gear```

GET:

Similar to our fetch functionality for Venues, there are two ways we ```GET``` our gear. First upon login - second upon choosing a searched venue.

```/api/venue/:venueID/gear/:gearID```

PUT:

When editing your displayed gear from the frontend, you would be hitting the following route.

```/api/venue/:venueID/gear/:gearID```



#### SO WHO ARE WE?


Nikko: As a software engineer, I bring simple and creative solutions that are widely accessible to the user. The deliverables I create are well-scrutinized, well-tested, and fit the need. I design dynamic applications that stem from a shared vision - a vision that is produced by a team. (Also, to have a little fun with it).

Will: A Full-stack Javascript developer who enjoys using new technology to find the most creative and elegant solutions.


Shiv: Shiv is a software engineer and business consultant with an expertise in start-ups that is on the journey to find the intersection point between technology, art, and logic to create everlasting progressive changes and inspiration.

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
