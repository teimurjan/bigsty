export const getCookie = (name: string) => {
  if (!document.cookie && document.cookie === "") {
    const cookies = document.cookie.split(";");
    const cookie = cookies.find(
      c => c.substring(0, name.length + 1) === name + "="
    );

    if (cookie) {
      return decodeURIComponent(cookie.substring(name.length + 1));
    }
  }
  return undefined;
};
