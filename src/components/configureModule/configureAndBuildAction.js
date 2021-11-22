import axios from "axios";
// import Cookies from 'universal-cookie';
export async function startProvisioning() {
  return fetch("/eii/ui/provision", {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ dev_mode: true }),
  })
    .then((response) => {
      console.log(response, "data");
      if (response.status == 200) {
        return response;
      } else {
        alert("Some Error occured");
      }
    })
    .catch((error) => {
      alert(error);
    });
}
export async function getStatusPercentage() {
  return fetch("/eii/ui/status", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((data) => data.json())
    .then(function (data) {
      if (data) {
        return data;
      } else {
        alert("Some Error occured");
      }
    })
    .catch((error) => {
      alert(error);
    });
}
export async function buildContainer() {
  return fetch("/eii/ui/build", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      services: ["*"],
      no_cache: false,
    }),
  })
    .then((data) => data.json())
    .then(function (data) {
      if (data) {
        return data;
      } else {
        alert("Some Error occured");
      }
    })
    .catch((error) => {
      alert(error);
    });
}
