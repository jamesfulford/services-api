# services-api

[Specification](https://docs.google.com/document/d/1wnZu4hu9RsH7COFtpa8af3pQy0NtOGhR54ajZxs61ZE/edit#)

I used later versions of dependencies.

`node -v` returns `v12.22.7`.

## Overview

Every User belongs to 1 Organization. This is not directly modelled or authenticated, but note that resources must have an `orgId` and APIs should not cross Organization boundaries.

Under each Organization are many [Services](./src/services/service.entity.ts), each of which _may_ have multiple [Versions](./src/services/versions/version.entity.ts).

(All test data is seeded in orgId 1.)

## List Services API

GET /v1/organization/{orgId}/services

Returns paginated list of Services (and respective Versions) sorted alphabetically.

```bash
curl 'http://localhost:3000/v1/organization/1/services?pageSize=2&page=2'
```

```json
{
  "data": [
    {
      "description": "Lorem 1",
      "id": "ba82a653-9bfd-4a9f-878f-0ff68a462583",
      "name": "FX Currency Rates International",
      "versions": []
    },
    {
      "description": "Lorem ipsum",
      "id": "fb248ffb-5a3d-4b20-ac3d-55f9baa2dcaf",
      "name": "Locate Us",
      "versions": [
        {
          "name": "v1",
          "status": "DRAFT",
          "swaggerLink": "https://swagger.io/v1"
        }
      ]
    }
  ],
  "meta": {
    "orgId": 1
  },
  "pagination": {
    "currentPage": 2,
    "firstPage": 0,
    "lastPage": 2,
    "nextPage": null,
    "pageSize": 2,
    "total": 6
  }
}
```

### Filtering

- `name=Currency`: optional string, filters by Service name.

No other fields were worth filtering on, see Assumptions.

### Pagination

- `page=0`: optional number, defaults to 0. Used for offset-based pagination.
- `pageSize=10`: optional number, defaults to 10. Used for offset-based pagination.

## Get By ID

GET /v1/organization/{orgId}/services/{id}

No additional fields provided at this time.

## Additional Assumptions

There is no sorting UI in the UX and requirements did not specify anything on sorting. If needed, can add as enhancement alongside UI.

### Questions I asked Karen:

1. What are the future product plans for "versions" of a service? Right now, I'm not putting in a different table because it is just a list of strings (limiting scope creep), but I might make different decisions if Product has already decided where to go with versions.

You can't see it and don't need to access it from the dashboard, but a version also has documentation (a Swagger file) and a status (draft, live, deprecated, end-of-life).

> Because of this, I opted to make Versions a separate entity. I also included a field for a swagger link and a version status.

2. Is the search feature intended for discovering new services or re-finding a service? "Search for a specific service" sounds like the user knows the name already, so I don't have to make descriptions searchable or make matching very fuzzy/lenient.

"Search" in this case means "filter" -- from the list of services already in the database/, find matches based on the user input. Pro tip: partial match ("name like '%foo%'" or similar) never got anyone disqualified. ;-) Include in your README which approach you chose and why.

> With this answer, I decided not to additionally search the 'description' field. I didn't think a broader fuzzy search was necessary.

3. Who are my users? Is it fair to assume for this exercise that Konnect (for the purposes of this exercise) is a multi-tenant app, so if you and I were in the Walmart tenant we could see the same services but will not be able to see any of the NYSE tenant's services?

A minimal approach assumes the user is already identified and that filtering middleware is outside the scope of this exercise. Feel free to extend that if you have the time. Again, include in your README any known limitations or assumptions you made.

> I assume each user belongs to an organization. I didn't model this directly and did not add authentication, however I did add a path param to capture the `orgId` of the request. This way, different orgs do not share Services.

## Thoughts

This is my first time working with NestJS and TypeORM, so had a learning curve on both of those.

TypeORM was better than:

- Django's ORM, simply because of Intellisense/typechecks/ease of use
- Mongoose, because mongoose does not handle types well
- Java, because (as with everything Java) it's very verbose

I did not like that TypeORM did not have a good answer on string escaping for `LIKE` functionality. I'd expect that from an ORM, so I'd be worried about community adoption and support.

I liked that NestJS was opinionated. The structure is very Angular-like (which is very Spring-like). The docs are fairly nice, though input validation was a bit tricky to work out. I would have hoped for a few more built-in pipes like `@Max()` or `@Min()` and to handle skipping validation on optional parameters. Spring is a bit nicer here, though I guess it beats raw Express.
