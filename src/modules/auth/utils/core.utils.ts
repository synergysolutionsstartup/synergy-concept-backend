export const generateOTP = () => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp.toString();
};

export function hasMinutesPassed(
  date: string | Date,
  minutesToCheck: number
): boolean {
  // Validate date input
  if (!date) {
    throw new Error("Date value is missing or undefined.");
  }

  // Convert to Date instance
  const providedDate = new Date(date);
  if (isNaN(providedDate.getTime())) {
    throw new Error("Invalid date value provided.");
  }

  // Get the current time
  const currentDate = new Date();

  // Calculate the difference in milliseconds
  const timeDifferenceInMilliseconds =
    currentDate.getTime() - providedDate.getTime();

  // Convert the difference to minutes
  const timeDifferenceInMinutes = timeDifferenceInMilliseconds / (1000 * 60);

  // Determine if enough time has passed
  const hasElapsed = timeDifferenceInMinutes > minutesToCheck;
  return hasElapsed;

}

export const getEmailTemplate = ({
  receiverName,
  title,
  message,
  url,
  buttonText,
}: any) => {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Pug</title>
    <style>
      body {
        background-color: #f9f9f9;
        padding-right: 10px;
        padding-left: 10px;
      }
      .content {
        background-color: #ffffff;
        border-color: #e5e5e5;
        border-style: solid;
        border-width: 0 1px 1px 1px;
        max-width: 600px;
        width: 100%;
        height: 420px;
        margin-top: 60.5px;
        margin-bottom: 31px;
        border-top: solid 3px #8e2de2;
        border-top: solid 3px -webkit-linear-gradient(to right, #8e2de2, #4a00e0);
        border-top: solid 3px -webkit-linear-gradient(to right, #8e2de2, #4a00e0);
        text-align: center;
        padding: 100px 0px 0px;
      }
      h1 {
        padding-bottom: 5px;
        color: #000;
        font-family: Poppins, Helvetica, Arial, sans-serif;
        font-size: 28px;
        font-weight: 400;
        font-style: normal;
        letter-spacing: normal;
        line-height: 36px;
        text-transform: none;
        text-align: center;
      }
      h2 {
        margin-bottom: 30px;
        color: #999;
        font-family: Poppins, Helvetica, Arial, sans-serif;
        font-size: 16px;
        font-weight: 300;
        font-style: normal;
        letter-spacing: normal;
        line-height: 24px;
        text-transform: none;
        text-align: center;
      }
      p {
        font-size: 14px;
        margin: 0px 21px;
        color: #666;
        font-family: 'Open Sans', Helvetica, Arial, sans-serif;
        font-weight: 300;
        font-style: normal;
        letter-spacing: normal;
        line-height: 22px;
        margin-bottom: 40px;
      }
      .btn-primary {
        background: #8e2de2;
        background: -webkit-linear-gradient(to right, #8e2de2, #4a00e0);
        background: linear-gradient(to right, #8e2de2, #4a00e0);
        border: none;
        font-family: Poppins, Helvetica, Arial, sans-serif;
        font-weight: 200;
        font-style: normal;
        letter-spacing: 1px;
        text-transform: uppercase;
        text-decoration: none;
        padding: 10px 20px;
        border-radius: 5px;
        color: #fff;
        cursor: pointer;
      }
      footer {
        max-width: 600px;
        width: 100%;
        height: 420px;
        padding-top: 50px;
        text-align: center;
      }
      small {
        color: #bbb;
        font-family: 'Open Sans', Helvetica, Arial, sans-serif;
        font-size: 12px;
        font-weight: 400;
        font-style: normal;
        letter-spacing: normal;
        line-height: 20px;
        text-transform: none;
        margin-bottom: 5px;
        display: block;
      }
      small:last-child {
        margin-top: 20px;
      }
      a {
        color: #bbb;
        text-decoration: underline;
      }
    </style>
  </head>
  <body>
    <div class="d-flex align-items-center justify-content-center">
      <div class="content">
        <h1>Hello, ${receiverName}</h1>
        <h2> ${title}</h2>
        <p>${message}</p>
        <a href="${url}" target="_blank">
        <button class="btn-primary" type="button">${buttonText}</button>
        <a>
        
      </div>
    </div>
    <div class="d-flex align-items-center justify-content-center">
      <footer>
        <small>Powered by Julien.js | A lightweight Node.js scaffold</small>
        <small>
          <a href="#" target="_blank">View Web Version</a> | 
          <a href="#" target="_blank">Email Preferences</a> | 
          <a href="#" target="_blank">Privacy Policy</a>
        </small>
        <small>If you have any questions, please contact us <a href="mailto:support@example.com" target="_blank">support@example.com</a></small>
        <small><a href="#" target="_blank">Unsubscribe</a> | from our mailing lists.</small>
      </footer>
    </div>
  </body>
  </html>
  `;
};
