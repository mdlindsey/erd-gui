# Postgres ERD GUI

The vision is to provide the superlative online GUI tool for database design; it will be the most feature-rich, performant, user-friendly option available and it will be hosted 100% free-to-use as it will be designed from the ground up to be client-side only.

The inspiration came from using pgAdmin's ERD tool and realizing I didn't want to have to download this application, establish a connection, and so forth just to design my database. Then I looked online and saw every option required sign-up so I wanted to offer an alternative - ie: the browser-based pgAdmin ERD tool clone.

Screenshots of the core functionality required for our app can be found in `/planning/images` and example output can be found in `/planning/samples` which contains the minified `design.pgerd` and the human-readable version of the same file converted to json format for syntax highlighting named `design.pgerd.formatted.json`.

This should be built with React TypeScript. Initially this will be built without NextJS or other major frameworks, but it should be designed in such a way that conversion to these later is simple and easy.

This will be 100% open source so code hygeine, styling, and ease of contribution are just as important as the core functionality; ie: developer experience is just as important as user experience.

The rest of this doc will serve as a decision log and documentation for future contributors to onboard and digest background context quickly enabling rapid contribution. For this reason, there must be a deeply thoughtful balance of being succinct and easy to read without leaving out any critical information.

## Product Requirements

July 28, 2025 @ 10:45pm

