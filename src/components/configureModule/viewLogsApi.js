export async function viewLogs(processname) {
  return fetch("/eii/ui/getlogs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      names: [processname],
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
