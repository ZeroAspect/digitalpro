async function GetIP(){
  try {
    const response = await fetch('https://api.ipify.org');
    const ip = await response.text();
    return ip;
  } catch (error) {
    console.error('Error fetching IP:', error);
    return null;
  }
}

module.exports = GetIP