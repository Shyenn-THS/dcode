import axios from 'axios';
import React, { ChangeEvent, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { SessionDetails } from '../types/typings';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { IoIosAddCircle, IoMdClose } from 'react-icons/io';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { uploadToCloudinary } from '../lib/uploadImage';

type Props = {};

const CreateCourse = (props: Props) => {
  const technologyRef = useRef<HTMLInputElement | null>();
  const categoryRef = useRef<HTMLInputElement | null>();
  const router = useRouter();
  const { data: session } = useSession();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
  } = useForm<SessionDetails>();

  const hiddenFileInput = useRef<HTMLInputElement | null>();
  const [preview, setPreview] = useState<string | undefined>();
  const [image, setImage] = useState<File>();

  const handleClick = () => {
    hiddenFileInput!.current!.click();
  };

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setImage(file);
    }
  }

  const [categories, setCategories] = useState<string[] | []>([]);
  const [technologies, setTechnologies] = useState<string[] | []>([]);

  const addTechnology = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const tech = technologyRef!.current!.value.trim();
    if (tech === '') {
      return;
    }

    setTechnologies([...technologies, tech]);
    technologyRef!.current!.value = '';
  };
  const addCategory = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const cat = categoryRef!.current!.value.trim();
    if (cat === '') {
      return;
    }

    setCategories([...categories, cat]);
    categoryRef!.current!.value = '';
  };

  const removeCategory = (deleteCategory: string) => {
    const newArray = categories.filter((category) => {
      return category !== deleteCategory;
    });

    setCategories(newArray);
  };

  const removeTechnology = (deleteTechnology: string) => {
    const newArray = technologies.filter((category) => {
      return category !== deleteTechnology;
    });

    setTechnologies(newArray);
  };

  const onSubmit = async (data: SessionDetails) => {
    const dataToSend = {
      ...data,
      categories,
      technologies,
      speaker: session?.user?.email,
      mainImage: await uploadToCloudinary(image!),
    };

    const res = await axios.post('/api/updateSession', dataToSend);
    if (res.status === 200) {
      toast.success('Session Updated Sucessfully!');
      router.push(`/sessions/${res.data.slug}`);
    } else {
      toast.error(res.data.error);
    }
  };

  return (
    <main>
      <section className="dark:bg-gray-1000 dark:text-gray-100">
        <div className="container mx-auto flex flex-col items-center px-4 py-16 text-center md:py-32 md:px-10 lg:px-32 xl:max-w-3xl">
          <h1 className="text-4xl font-bold leading-none sm:text-5xl">
            Educate others with your{' '}
            <span className="text-blue-800">Knowledge</span>
          </h1>
          <p className="px-8 mt-8 mb-12 text-lg">
            Take a live session and educate others from what you are best in.
            Also get chance to grow a community and earn some ETH.
          </p>
          <div className="flex flex-wrap justify-center space-x-4">
            <button className="btn btn-primary">Get started</button>
            <button className="btn btn-outline text-gray-100">
              Learn more
            </button>
          </div>
        </div>
      </section>

      <section className="px-6 pb-20 dark:bg-gray-1000 dark:text-gray-50">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="container flex flex-col mx-auto space-y-12 ng-untouched ng-pristine ng-valid"
        >
          <fieldset className="grid grid-cols-4 gap-6 p-6 rounded-md shadow-sm dark:bg-gray-900">
            <div className="space-y-2 col-span-full lg:col-span-1">
              <p className="font-medium">Session Details</p>
              <p className="text-xs">
                Add details about session you are gonna take.
              </p>
            </div>
            <div className="grid grid-cols-6 gap-4 col-span-full lg:col-span-3">
              <div className="col-span-full sm:col-span-3">
                <label htmlFor="username" className="text-sm">
                  Title
                </label>
                <input
                  id="username"
                  type="text"
                  placeholder="Ex. Learn React JS"
                  className="w-full rounded-md  dark:text-gray-900 px-4 py-2"
                  {...register('title', { required: true })}
                />
              </div>
              <div className="col-span-full sm:col-span-3">
                <label htmlFor="website" className="text-sm">
                  Subtitle
                </label>
                <input
                  id="website"
                  type="text"
                  placeholder="Ex. Learn what is components and how to work with them."
                  className="w-full rounded-md  dark:text-gray-900 px-4 py-2"
                  {...register('subtitle', { required: true })}
                />
              </div>
              <div className="col-span-full">
                <label htmlFor="bio" className="text-sm">
                  Description
                </label>
                <textarea
                  id="bio"
                  placeholder="Write something about session...."
                  className="w-full rounded-md  dark:text-gray-900 px-4 py-2"
                  {...register('description')}
                ></textarea>
              </div>

              <div className="col-span-full">
                <label htmlFor="bio" className="text-sm">
                  Photo
                </label>
                <div className="flex items-center w-full h-96 overflow-hidden space-x-2">
                  <Image
                    src={preview ? preview : '/assets/file-upload.png'}
                    alt="Title Image"
                    height={400}
                    width={1600}
                    className=""
                    onClick={handleClick}
                  />
                  <input
                    ref={hiddenFileInput}
                    onChange={handleChange}
                    type="file"
                    accept="jpg, png, jpeg"
                    style={{ display: 'none' }}
                  />
                </div>
              </div>
            </div>
          </fieldset>

          <fieldset className="grid grid-cols-4 gap-6 p-6 rounded-md shadow-sm dark:bg-gray-900">
            <div className="space-y-2 col-span-full lg:col-span-1">
              <p className="font-medium">Date and Time</p>
              <p className="text-xs">Select date and time for the session.</p>
            </div>
            <div className="grid grid-cols-6 gap-4 col-span-full lg:col-span-3">
              <div className="col-span-full sm:col-span-3">
                <label htmlFor="username" className="text-sm">
                  Start Date
                </label>
                <input
                  id="startDate"
                  type="date"
                  placeholder="Ex. Learn React JS"
                  className="w-full rounded-md  dark:text-gray-900 px-4 py-2"
                  {...register('startDate', { required: true })}
                />
              </div>
              <div className="col-span-full sm:col-span-3">
                <label htmlFor="website" className="text-sm">
                  Start Time
                </label>
                <input
                  id="startTime"
                  type="time"
                  placeholder="Ex. Learn what is components and how to work with them."
                  className="w-full rounded-md  dark:text-gray-900 px-4 py-2"
                  {...register('startTime', { required: true })}
                />
              </div>
              <div className="col-span-full sm:col-span-3">
                <label htmlFor="website" className="text-sm">
                  Expected Duration
                </label>
                <input
                  id="duration"
                  type="number"
                  min={1}
                  max={5}
                  placeholder="1-5"
                  className="w-full rounded-md  dark:text-gray-900 px-4 py-2"
                  {...register('duration', { required: true })}
                />
              </div>
            </div>
          </fieldset>

          <fieldset className="grid grid-cols-4 gap-6 p-6 rounded-md shadow-sm dark:bg-gray-900">
            <div className="space-y-2 col-span-full lg:col-span-1">
              <p className="font-medium">Others</p>
              <p className="text-xs">
                Select technologies and chategories for your session.
              </p>
            </div>
            <div className="grid grid-cols-6 gap-4 col-span-full lg:col-span-3">
              <div className="col-span-full sm:col-span-3">
                <label htmlFor="username" className="text-sm">
                  Technologies
                </label>
                <div
                  id="addTechnology"
                  className="w-full h-10 space-x-2 overflow-x-auto rounded-md dark:bg-gray-50 dark:text-gray-900 px-4 py-2"
                >
                  {technologies?.map((technology, idx) => {
                    return (
                      <div key={idx} className="badge">
                        {technology}
                        <IoMdClose
                          className="ml-1 cursor-pointer"
                          onClick={() => removeTechnology(technology)}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="col-span-full sm:col-span-3">
                <label htmlFor="website" className="text-sm">
                  Add Technology
                </label>
                <div className="flex space-x-2 justify-center items-center">
                  <input
                    type="text"
                    ref={technologyRef}
                    placeholder="Enter technology and press Add Icon."
                    className="w-full rounded-md  dark:text-gray-900 px-4 py-2"
                  />
                  <IoIosAddCircle
                    type="button"
                    onClick={addTechnology}
                    className="text-4xl cursor-pointer"
                  />
                </div>
              </div>

              <div className="col-span-full sm:col-span-3">
                <label htmlFor="username" className="text-sm">
                  Categories
                </label>
                <div className="w-full h-10 space-x-2 overflow-x-auto rounded-md dark:bg-gray-50 dark:text-gray-900 px-4 py-2">
                  {categories?.map((category, idx) => {
                    return (
                      <div key={idx} className="badge">
                        #{category}
                        <IoMdClose
                          className="ml-1 cursor-pointer"
                          onClick={() => removeCategory(category)}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="col-span-full sm:col-span-3">
                <label htmlFor="website" className="text-sm">
                  Add Category
                </label>
                <div className="flex space-x-2 justify-center items-center">
                  <input
                    type="text"
                    ref={categoryRef}
                    placeholder="Enter category and press Add Icon."
                    className="w-full rounded-md  dark:text-gray-900 px-4 py-2"
                  />
                  <IoIosAddCircle
                    type="button"
                    onClick={addCategory}
                    className="text-4xl cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </fieldset>
          <button type="submit" className="btn btn-primary w-fit mx-auto px-10">
            Submit
          </button>
        </form>
      </section>
    </main>
  );
};

export default CreateCourse;
