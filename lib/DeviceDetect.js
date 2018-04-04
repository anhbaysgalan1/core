import deviceDetect from "device-detect";

export default function() {
  let platformId;

  switch (deviceDetect().device) {
    case "iPhone":
    case "iPad":
    case "iPod":
      platformId = 2;
      break;

    case "Android":
      platformId = 3;
      break;

    case "Blackberry":
    case "WindowsMobile":
    case "Macintosh":
    case "Windows":
    case "Linux":
      platformId = 1; // Web
      break;

    default:
      platformId = 4; // Default for unknown platform id
      break;
  }

  return platformId;
}
