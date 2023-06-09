# { Edictor }
> <h2>Modular & Self-Contained
> Javascript object
> definition and validation
> with concise APIs</h2>

---
## Documentation
---
Please read usage documentation at
https://nitipit.github.io/edictor/

---
## Features
---
- Object definition is easy to use.
- Provide concise APIs for validations.
- Validation throws error.
- **Modular** : `Model` and `Field` can be extends and reused as class and object in ES6.
- **Self-contained** : object created from definition will validate
  itself when object's data changed.
- **Atomic Update** : `Model().update(data)` will update data as all or nothingaccording to validations.
- Tiny & Compact : ~2kB minify + gzip
  

---
## Library Development
---

### Environment
- NodeJS

### Recommended editor
- Visual Studio Code https://code.visualstudio.com/

### Setup
```shell
$ git clone git@github.com:nitipit/edictor.git
$ cd edictor
$ npm install
```
### Run test for development process
```shell
$ npm run test-watch
```
The command above will run [jest](https://jestjs.io/) testing framework in watch mode.

To test individual file:
```shell
$ npx jest --watch src/edictor/field.test.ts
```

### Build { edictor } library
```shell
npm run build
```

---
## Documentation Development
---

### Environment
- Python
- NodeJS

### Recommended editor
- Visual Studio Code https://code.visualstudio.com/

### Generate static html (Compatible with github page)
- Result as this page: https://nitipit.github.io/edictor/
- Command belows will generate static html and start
  HTTP Server
- Static html is generated by https://nitipit.github.io/engrave/

```shell
$ python -m venv venv
$ source venv/bin/activate
$ pip install -r require.pip
$ python docs.py
Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/)
```

---
## Contribution
---
Contributions are what make the open source community such an amazing place to learn,
inspire, and create. Any contributions you make are greatly appreciated.

If you have a suggestion that would make this better, please fork the repo
and create a pull request. You can also simply open an issue with the tag
"enhancement". Don't forget to give the project a star! Thanks again!

Fork the Project
Create your Feature Branch (git checkout -b feature/AmazingFeature)
Commit your Changes (git commit -m 'Add some AmazingFeature')
Push to the Branch (git push origin feature/AmazingFeature)
Open a Pull Request

---
## Contact
---

Nitipit Nontasuwan - nitipit@gmail.com

Project repository: https://github.com/nitipit/edictor  
Project website: https://nitipit.github.io/edictor/