import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { uploadToCloudinary } from '../lib/uploadImage';
import { UserDetails } from '../typings';
import axios from 'axios';
import toast from 'react-hot-toast';

type Props = {};

const Profile = (props: Props) => {
  const { data: session } = useSession();
  const hiddenFileInput = useRef();
  const [preview, setPreview] = useState<string | undefined>();
  const [image, setImage] = useState<File>();

  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setImage(file);
    }
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
    setValue,
  } = useForm<UserDetails>();

  const onSubmit = async (data: UserDetails) => {
    const dataToSend = {
      ...data,
      image: image ? await uploadToCloudinary(image!) : session?.user?.image,
      email: session?.user?.email,
      username: session?.user?.username,
    };

    const res = await axios.post('/api/updateUser', dataToSend);
    if (res.status === 200) {
      toast.success('Profile Updated Sucessfully!');
    } else {
      toast.error(res.data.error);
    }
  };

  useEffect(() => {
    setValue('fname', session?.user.fname);
    setValue('lname', session?.user.lname);
    setValue('bio', session?.user.bio);
    setValue('instagram', session?.user.instagram);
    setValue('twitter', session?.user.twitter);
    setValue('linkedin', session?.user.linkedin);
    setValue('website', session?.user.website);
    setValue('profession', session?.user.profession);
    setPreview(session?.user.image);
  }, [session]);

  return (
    <main className="dark:bg-gray-1000 py-16">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="container mx-auto flex flex-col space-y-12 dark:bg-gray-800"
      >
        <fieldset className="grid grid-cols-4 gap-6 p-6 rounded-md shadow-sm">
          <div className="space-y-2 col-span-full lg:col-span-1">
            <p className="font-medium">Personal Inormation</p>
            <p className="text-xs">Tell your audience about yourself.</p>
          </div>
          <div className="grid grid-cols-6 gap-4 col-span-full lg:col-span-3">
            <div className="col-span-full sm:col-span-3">
              <label htmlFor="firstname" className="text-sm">
                First name
              </label>
              <input
                type="text"
                placeholder="First name"
                className="w-full rounded-md  dark:text-gray-900 px-4 py-2 outline-none border-none "
                {...register('fname', { required: true })}
              />
            </div>
            <div className="col-span-full sm:col-span-3">
              <label htmlFor="lastname" className="text-sm">
                Last name
              </label>
              <input
                type="text"
                placeholder="Last name"
                className="w-full rounded-md  dark:text-gray-900 px-4 py-2 outline-none border-none"
                {...register('lname', { required: true })}
              />
            </div>
            <div className="col-span-full sm:col-span-3">
              <label htmlFor="email" className="text-sm">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Email"
                disabled
                value={session?.user?.email!}
                className="w-full rounded-md  dark:text-gray-900 px-4 py-2 outline-none border-none "
              />
            </div>
            <div className="col-span-full sm:col-span-3">
              <label htmlFor="website" className="text-sm">
                Website
              </label>
              <input
                id="website"
                type="text"
                placeholder="https://yourwebsitename.com"
                className="w-full rounded-md  dark:text-gray-900 px-4 py-2"
                {...register('website')}
              />
            </div>
            <div className="col-span-3">
              <label htmlFor="profession" className="text-sm">
                Profession
              </label>
              <input
                id="profession"
                type="text"
                placeholder="Tell us about your profession. Ex. Studnet, Working Proffesional..."
                {...register('profession')}
                className="w-full rounded-md  dark:text-gray-900 px-4 py-2 outline-none border-none "
              />
            </div>
            <div className="col-span-3">
              <label htmlFor="username" className="text-sm">
                Username
              </label>
              <input
                id="username"
                type="text"
                disabled
                value={session?.user.username}
                className="w-full rounded-md  dark:text-gray-900 px-4 py-2 outline-none border-none "
              />
            </div>
            <div className="col-span-full sm:col-span-2">
              <label htmlFor="city" className="text-sm">
                Instagram
              </label>
              <input
                id="city"
                type="text"
                placeholder="https://www.instagram.com/username"
                className="w-full rounded-md  dark:text-gray-900 px-4 py-2 outline-none border-none "
                {...register('instagram')}
              />
            </div>
            <div className="col-span-full sm:col-span-2">
              <label htmlFor="state" className="text-sm">
                Linkedin
              </label>
              <input
                id="state"
                type="text"
                placeholder="https://www.linkedin.com/in/username"
                className="w-full rounded-md  dark:text-gray-900 px-4 py-2 outline-none border-none "
                {...register('linkedin')}
              />
            </div>
            <div className="col-span-full sm:col-span-2">
              <label htmlFor="zip" className="text-sm">
                Twitter
              </label>
              <input
                id="zip"
                type="text"
                placeholder="https://twitter.com/username"
                className="w-full rounded-md  dark:text-gray-900 px-4 py-2 outline-none border-none "
                {...register('twitter')}
              />
            </div>
            <div className="col-span-full">
              <label htmlFor="bio" className="text-sm">
                Bio
              </label>
              <textarea
                id="bio"
                placeholder="Write something cool about you...."
                className="w-full rounded-md  dark:text-gray-900 px-4 py-2"
                {...register('bio')}
              ></textarea>
            </div>
            <div className="col-span-full">
              <label htmlFor="bio" className="text-sm">
                Photo
              </label>
              <div className="flex items-center space-x-2">
                <Image
                  src={preview!}
                  alt={session?.user?.name!}
                  height={1080}
                  width={1080}
                  className="w-10 h-10 object-cover rounded-full dark:bg-gray-700"
                />
                <input
                  ref={hiddenFileInput}
                  onChange={handleChange}
                  type="file"
                  accept="jpg, png, jpeg"
                  style={{ display: 'none' }}
                />
                <button
                  type="button"
                  onClick={handleClick}
                  className="px-4 py-2 border rounded-md dark:border-gray-100"
                >
                  Change
                </button>
              </div>
            </div>
          </div>
        </fieldset>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </main>
  );
};

export default Profile;
