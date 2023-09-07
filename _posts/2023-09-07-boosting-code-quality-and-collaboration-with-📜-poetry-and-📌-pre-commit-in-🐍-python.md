---
layout: post
title: Boosting code quality and collaboration with 📜 Poetry and 📌 Pre-commit in 🐍 Python
description: This is a collection of short CSS snippets I thought might be useful for beginners
summary: This is a collection of short CSS snippets I thought might be useful for beginners.
tags: python devops coding
toc: true
---

## Python and dependencies

Using python in our daily life, we more often than not tend to use a *lot* of different libraries. 
That is the beauty of python after all! A lush ecosystem of libraries that are just one 
`pip install` away, with which we can avoid reinventing the wheel and focus on what really matters:
a *good product*.

Most people will use `pip` to install their dependencies whenever they need them, stuffing 
them in the global python environment. This is fine if in a hurry, but it is not the best
practice, and on some systems (like Linux) it can even be dangerous[^1] to your system's health.

For this reason, it is recommended to use virtual environments[^2], which are isolated python
environments that can be created and destroyed at will. While having a few virtual environments
as a substitute for the global python environment is often *good enough*, a bit more structure
can allow us to boost our repository's code quality and collaboration into **overdrive!** 🚀

## Enter Poetry

[Poetry](https://python-poetry.org/) is a python package manager that allows dependency 
management in a more structured way, similar to `npm` or `yarn` in the javascript world.

With it, we can create virtual environments on a *per-project* basis, moreover, `poetry` 
will ensure that all of our dependencies are specified in a `pyproject.toml` file, which
anyone can use to recreate the same environment on their machine.

This means that if we have a project that is shared with a bunch of collaborators, we can
offer them a way to install a complete development environment with a single command,
and they will be able to work on the project without having to chase the required dependencies
for hours on end.

### Getting Poetry

Let's first use our package manager of choice to install poetry (or if you don't have one, you can 
use `pipx`, all methods are listed in the [official documentation](https://python-poetry.org/docs/#installation)):

```bash
python -m pip install --user pipx
python -m pipx ensurepath

# restart your shell

pipx install poetry
```

Also, before we get any real work done, let's also make it so that poetry installs virtual environments
in the project's directory, so that our IDE can find them more easily:

```bash
poetry config virtualenvs.in-project true 
```

with this, we are ready to start a new project!

### A Poetry showcase project: `dummy_API`

Let's demonstrate how poetry works with a simple project: a dummy API that returns a "Hello World" message.
For that, we will use the [FastAPI](https://fastapi.tiangolo.com/) library, which is a modern python framework
for building APIs.

{% include lazyload.html src = "/assets/img/dummy_api.webp" alt = "GIF showing how to initialize a project with Poetry" title = "GIF showing how to initialize a project with Poetry" caption = "Here I initialize the `dummy_API` project, which creates a folder ready to use. I also add all the required dependencies, such as `fastapi` and `uvicorn`." %}

If you followed along with the GIF, you should now have a folder called `dummy_API` with the following structure:

```bash
.
├── dummy_api
│   └── __init__.py
├── tests
│   └── __init__.py
├── poetry.lock
├── pyproject.toml
├── README.md
└── tree.md
```

We can see that there are *two* folders, one is called `dummy_api` and the other `tests`.
In the `dummy_api` we will have our code, which can then be exported as a python package, while in the `tests` folder
we will have our unit tests, which will import the code from the `dummy_api` folder.

We also have a `pyproject.toml` file, which is the file that poetry uses to keep track of our dependencies, and a `poetry.lock` file,
the `poetry.lock` file keeps track of the **exact** versions of our dependencies, so that we can recreate the same environment, whereas
the `.toml` is more relaxed, and acts like a "wish list" for our libraries, letting poetry decide which versions to install.

Let's see the contents of the `pyproject.toml` file before we get to code our API:

```toml
[tool.poetry]
name = "dummy-api"
version = "0.1.0"
description = ""
authors = ["your-name <your-email-here@provider.com>"]
readme = "README.md"

[tool.poetry.dependencies]
python = "^3.11"
fastapi = "^0.103.1"
uvicorn = "^0.23.2"


[tool.poetry.group.dev.dependencies]
requests = "^2.31.0"

[build-system]
requires = ["poetry-core"]
build-backend = "poetry.core.masonry.api"
```

In there we got some metadata about our project, such as the name, version, and description, as well as a list of dependencies.
Notice how the dependencies are divided into two sections: `tool.poetry.dependencies` and `tool.poetry.group.dev.dependencies`,
the first one is for dependencies that are required for the project to run, while the second one is for dependencies that are only
required for development.

For example, say that you are building a data science project, and you would like to visualize your data as you go,
you can run `poetry add --group dev matplotlib` to install `matplotlib` only in the development environment, so that it won't be
shipping with your project when you deploy it!

#### Coding the API



Now that we have seen how Poetry handles project initialization, let's get to coding our API![^skip]

First, we will create our application in the `dummy_api` folder, in a file called `dummy_app.py`:

```python
# Straight from the FastAPI docs: 
# https://fastapi.tiangolo.com/tutorial/first-steps/

from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}
```

Here we define a single endpoint a the root of our API, which returns a JSON object with a "message" key and a "Hello World" value.

We don't really need to export anything as accessing this API will be done through the [uvicorn](https://www.uvicorn.org/) server. If we had some utility functions to 
export, we would do so in the `__init__.py` file, with a very simple syntax:

```python
from .dummy_app import *
```

#### Testing the API

Now that we have our API, we want to make sure that it works as intended, so we will write some unit tests for it. We will use the [pytest](https://docs.pytest.org/en/6.2.x/)
 framework, so make sure to install it with `poetry add --group dev pytest` before proceeding!

To create a test, we will create a file in the `tests` folder, called `test_root.py`, the job of 
this unit test is to check that the root endpoint returns a JSON object with the correct message.

```python
import requests as r

def test_get() -> None:
    localhost = "http://localhost:8000"
    
    # Test the root endpoint
    response = r.get(localhost)
    
    assert response.status_code == 200
    assert response.json() == {"message": "Hello World"}
```

<br>

Now that everything is in place, we can run our API with `poetry run uvicorn dummy_api.dummy_app:app --reload` and our tests with `poetry run pytest`[^3].
If everything went well, you should see something like this:

{% include lazyload.html src = "/assets/img/test_api.webp" alt = "GIF showing the tests running" title = "GIF showing the tests running" caption = "Here I run the API and the tests, and everything works as expected!"%}


### What we got from Poetry

Now that our "project" is done, let's see what we got from using Poetry:

- A virtual environment, which can be recreated by anyone with `poetry install`
- A project structure that is `PyPI` ready, so that we can export our code as a python package with a simple `poetry publish`

These are already great features, but we can do even **better** by adding more tools to our 
now-reproducible environment!


## Integrating a CI/CD pipeline in our project

Now that we have a project that can easily set up an environment on any machine, we can prepare
an environment that can act as a **force multiplier** for our team's productivity: a CI/CD pipeline.

Pretend that you are working on a project with a team of 5 people. It is inevitable that all
of you have varying degrees of *experience* with python, as well as different coding styles and
habits. This means that the code that each one of you writes will also be of *different quality*,
which over time can lead to a codebase that is hard to maintain and extend.

Forcing everyone to write code in the same way is not only a terrible idea, it's simply not
feasible! what we can do now is to *automate* the process of checking the code quality, by
providing everyone with an environment that comes pre-packaged with tools that 
will automatically check new commits, and reject them if they contain *code smells*.

### Enter Pre-commit

[Pre-commit](https://pre-commit.com/) is a tool that allows us to run *hooks* on our 
repository as soon as we commit new code. These hooks can be anything from code formatters
to linters, and are available for a wide variety of languages, not just python!

The tools that we are going to use are:

* [black](https://github.com/psf/black) - A code formatter that will provide us with uniform style across the codebase
* [flake8](https://flake8.pycqa.org/en/latest/) - A linter that will check for code smells and potential bugs
* [mypy](https://mypy.readthedocs.io/en/stable/) - A static type checker that will help us catch type errors
* [pytest](https://docs.pytest.org/en/6.2.x/) - We already know this one! It will run our unit tests on every commit

Let's use poetry to pull them all in!

```bash
poetry add --group dev pre-commit black flake8 mypy
```

Now that we got the good stuff, we still need to do a bit of work to create a `.yaml` file that will tell pre-commit to run all of 
our tools on every commit.
We do it with the following commands:

```bash 
git init # if you haven't already made dummy_API a git repository

poetry run pre-commit install # tells pre-commit to install the hooks in the .git/hooks folder
poetry run pre-commit sample-config > .pre-commit-config.yaml # gives us a sample .yaml file
```

We are now left with a `.pre-commit-config.yaml` file that we can edit to our liking. Let's 
add all of our tools to it and see what we get:

```yaml
# See https://pre-commit.com for more information
# See https://pre-commit.com/hooks.html for more hooks
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.4.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-yaml
      - id: check-added-large-files
  - repo: https://github.com/psf/black
    rev: 23.7.0
    hooks:
      - id: black

  - repo: https://github.com/pre-commit/mirrors-mypy
    rev: "v1.5.1"
    hooks:
      - id: mypy
        entry: mypy --ignore-missing-imports --follow-imports=skip --show-column-numbers .
        language: system
        types: [python]
        pass_filenames: false
        stages: [commit]

  - repo: https://github.com/PyCQA/flake8
    rev: 6.1.0
    hooks:
      - id: flake8

  - repo: local
    hooks:
      - id: pytest
        name: pytest
        entry: pytest
        language: system
        types: [python]
        pass_filenames: false
        stages: [commit]
        args: [-v]
        always_run: true
        verbose: true

```
*Here is the `.yaml` that we end up with, feel free to use it as a starting point for your own projects!*

### Pre-commit in action

Now that tooling is ready, let's see what happens when we try to commit some code:

{%include lazyload.html src = "/assets/img/precommit.webp" alt = "GIF showing the pre-commit hooks in action" title = "GIF showing the pre-commit hooks in action" caption = "Here we push a commit to our repository, and the pre-commit hooks run automatically, formatting our code and checking for errors. We can see that everything went through, hence the code is of good quality! if there were any errors, we would need to fix them and then run the commit again."%}

Having these checks at every commit gives us precious guarantees about the quality of our code,
but we can only rely on them if we are sure that everyone is using the same tools. This is why
Poetry is so important: it allows us to bundle `pre-commit` with our project, so that everyone
can run the hooks from day one!

## Final thoughts

In this article, we have seen that by employing a dependency manager such as Poetry, we can 
provide all of our collaborators with a way to set up a development environment in a matter of seconds.
With this in place, we can embed some infrastructure in our repository to ensure that code standards
are met, and that the code is of good quality.[^4]

Thanks to Poetry, your collaborators won't even have to spend time trying to gather all the tools 
for the CI/CD pipeline to work[^5], and you can be sure that the code that you are shipping is of good quality. ✨🚀

The initial setup might seem a bit daunting if you are not used to it, but it is well worth the effort,
as you will reap the benefits for the rest of the project's lifetime!

<br>
<hr>
<br>

[^1]: Installing dependencies globally with pip means they won't be tracked by your package manager, potentially causing version conflicts, missed updates, and security issues — a recipe for dependency hell! 🩹🤕

[^2]: Check out the [official documentation](https://docs.python.org/3/library/venv.html) for more information on virtual environments.

[^3]: If you are using the interpreter provided by the poetry virtual environment, you can omit the `poetry run` part of the commands, which can be a bit tedious to type.

[^4]: If you're looking to include more complex checks in your pipeline, but are worried that it might slow down your commits, you can set up another CI/CD pipeline on your remote repository with tools such as [GitHub Actions](https://github.com/features/actions) or [GitLab CI/CD](https://docs.gitlab.com/ee/ci/). This way, you can enforce consistency at every step of the development process, without slowing down your local commits! 🚀

[^5]: And they also won't risk forgetting to install the pipeline altogether, which ensures that everyone is working under the same standards! 😄

[^skip]: If you want to skip the coding part, you can jump to the next section [here](#integrating-a-cicd-pipeline-in-our-project).

*[CI]: Continuous Integration
*[CD]: Continuous Deployment