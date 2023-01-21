import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { SocialIcon } from 'react-social-icons';

type Props = {};

const social = ['https://shivangmishra.hashnode.dev'];
const womens = [
  {
    name: 'Become Confident',
    href: '/become-confident',
  },
  {
    name: 'Add Projects',
    href: '/add-project',
  },
  {
    name: 'Confidence Guide',
    href: '/confidence-guide',
  },
];

const company = [
  {
    name: 'Home',
    href: '/',
  },
  {
    name: 'Support Us',
    href: '/support-us',
  },
  {
    name: 'Contact Us',
    href: '/contact-us',
  },
];

const sessions = [
  {
    name: 'Live Sessions',
    href: '/live-sessions',
  },
  {
    name: 'Take a Session',
    href: '/take-session',
  },
];

const Footer = (props: Props) => {
  return (
    <footer className="px-4 dark:bg-gray-1100 dark:text-gray-100 divide-y text-cascade-700 bg-white-linen mx-auto ">
      <div className="container flex flex-col justify-between py-10 mx-auto space-y-8 lg:flex-row lg:space-y-0">
        <div className="lg:w-1/4 relative">
          <Image src="/assets/DcodeLogo.svg" fill alt="Decode Logo" />
        </div>
        <div className="grid grid-cols-2 text-sm gap-x-3 gap-y-8 lg:w-2/3 sm:grid-cols-4">
          <div className="space-y-3">
            <h3 className="tracking-wide uppercase font-medium">Sessions</h3>
            <ul className="space-y-1 flex flex-col">
              {sessions.map((section, idx) => {
                const { name, href } = section;
                return (
                  <Link key={idx} href={href}>
                    {name}
                  </Link>
                );
              })}
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="tracking-wide uppercase font-medium">Company</h3>
            <ul className="space-y-1 flex flex-col">
              {company.map((section, idx) => {
                const { name, href } = section;
                return (
                  <Link key={idx} href={href}>
                    {name}
                  </Link>
                );
              })}
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="uppercase font-medium">For Womens</h3>
            <ul className="space-y-1 flex flex-col">
              {womens.map((section, idx) => {
                const { name, href } = section;
                return (
                  <Link key={idx} href={href}>
                    {name}
                  </Link>
                );
              })}
            </ul>
          </div>
          <div className="space-y-3">
            <div className="uppercase font-medium">Social media</div>
            <div className="flex justify-start space-x-3">
              {social.map((social, idx) => {
                return (
                  <SocialIcon
                    className=""
                    fgColor="#FFFFFF"
                    bgColor="#84a59d"
                    href={social}
                    key={idx}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="py-6 text-sm text-center dark:text-cascade-400">
        © {new Date().getFullYear()} SheConfident. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
