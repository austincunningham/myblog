# myblog

Blog site that uses vue and a markdown converter to host blogs.

To add a new blog 
- Add the markdown file to to the `./markdown/<year>` directory
- Update the `./static/bloglist.json`
e.g. test.md in 2019 directory would mean you need to add to the 2019 array
```json
"2019": [
{
    "id":"test",
    "date": "Jan 01, 2019",
    "title": "title of test.md",
    "description": "description of test.md"
}
]
```
- To add a homepage image add an image the same name file name as the markdown file e.g. test.png to the `public/images` directory
- commit and push your changes
- run `./deploy.sh`

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
