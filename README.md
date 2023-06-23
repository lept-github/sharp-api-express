# sharp-api-express

Welcome to the documentation for sharp-api-express. It wraps the functionality of the Sharp.js library and exposes it as a RESTful API. This documentation will guide you through the setup, usage, and available endpoints of the API.

## Installation

1. Clone the [repository](https://github.com/lept-github/sharp-api-express) containing the API code.
2. Make sure you have Docker installed on your machine.
3. Build the Docker image using the provided Dockerfile.
   - `$ sudo docker build -t your-image-name . `

## Usage

Once the image is built, you can run it in a containerized environment.

`$ sudo docker run -p 8000:8000 your-image-name`

## Endpoint

`POST /v1/sharp/:operation`

### Request

- `:operation`: it accepts all the "Image Operation" and "Colour Manipulation" from the [Sharp Documentation](https://sharp.pixelplumbing.com).

- `image`: form data that resides in the request body, and it is the base64-encoded image data.

- `options` form data that resides in the request body, corresponds to the parameters accepted by the operation called.

### Response

- `Content-Type`: will be the same as the image provided in the request.
