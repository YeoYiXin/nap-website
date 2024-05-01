# A Novel IoT-Based Problem Reporting System Utilising Human Sensors: A Case Study at University of Nottingham Malaysia

<h1>Nott-A-Problem (NAP) website</h1>
<p>The website developed to visualise the way administration will view the submitted report.</p>

<h1>Motivation</h1>
<ul>
  <li>Existing problem-reporting system at UNM required users to navigate through multiple complex web interfaces and fill out extensive forms which can be time consuming
    <br/>
    <img src="https://github.com/YeoYiXin/Problem-Reporting-System/assets/89788614/7219cfe2-e29a-42d4-b556-df78feb26878" alt="drawing" width="500"/>
    <br/>
    <img src="https://github.com/YeoYiXin/Problem-Reporting-System/assets/89788614/5eb156bb-65c2-4897-9ce4-1bbe7081bdc3" alt="drawing" width="500"/>
  </li>
  <li>Consequently, many students and staff found the process so daunting that they resorted to either walking to relevant offices during working hours, making phone calls to report issues, or disregard the issue, a solution that clearly contradicts the principles of modern, digital-first campus environments.</li>
</ul>

<h1>Technology Stacks Used</h1>
<p><b>Framework: </b>Next.js</p>
<p><b>Programming Language: </b>React TypeScript, TailwindCSS</p>
<p><b>Backend: </b> 
  <ul>
    <li>Google Maps for displaying location on a map view</li>
    <li>Firebase for Cloud Firestore, and Storage</li>
  </ul>
</p>
<h1>Features</h1>
<ul>
  <li>Visualisation of the submitted problem report on the administration view.</li>
  <li>Filter email according to location, status, problem class and department.</li>
  <li>Delete or edit the problem report.</li>
  <li>View statistical information of the reported problem.</li>
  <li>Accurate list of available departments.</li>
</ul>


<h1>Installations</h1>

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

For more information, [the Next.js GitHub repository](https://github.com/vercel/next.js/) 

<h1>Folder Structure</h1>
NAP project folder structure:
<code>
C:.
├───app
├───components
│   ├───dashboard
│   │   └───statistics
│   ├───department
│   ├───email
│   │   ├───buttons
│   │   │   └───display_email
│   │   └───features
│   └───header
│       ├───button
│       └───navbar
└───firebase</code>

<h1>Website Pages</h1>
<br/>
![Screenshot (12342)](https://github.com/YeoYiXin/nap-website/assets/89788614/ac7c021f-8ef4-4229-95cb-43a62a80bbcc)

<img src="https://github.com/YeoYiXin/nap-website/assets/89788614/ac7c021f-8ef4-4229-95cb-43a62a80bbcc" alt="drawing" width="450"/>
<br/>
<img src="https://github.com/YeoYiXin/nap-website/assets/89788614/16aa04ce-80c7-4f34-b86d-562d9c8158a3" alt="drawing" width="450"/>
<br/>
<img src="https://github.com/YeoYiXin/nap-website/assets/89788614/cbafd4ff-20f4-4ec2-95b7-294f17879489" alt="drawing" width="450"/>
<br/>

<p>All credits belong to SEGP Group B 2023/24</p>
