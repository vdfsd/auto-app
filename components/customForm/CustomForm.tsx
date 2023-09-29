"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button } from "../button/Button";
import { Input } from "../input/Input";
import { motion } from "framer-motion";
import Image from "next/image";
import { AiOutlineClose } from "react-icons/ai";
import { v4 as uuidv4 } from "uuid";
import { services, states } from "./datas";
import { models } from "./models";
import { makes } from "./makes";
import { years } from "./years";
import { IService } from "@/interfaces/form";
import PhoneInputWithCountry from "react-phone-number-input/react-hook-form";
import { isPossiblePhoneNumber } from "react-phone-number-input";
import { CustomTextArea } from "../customTextArea/CustomTextArea";
import { CustomSelect } from "../customSelect/CustomSelect";
import metadata from "libphonenumber-js/metadata.min.json";
import "react-phone-number-input/style.css";
import toast from "react-hot-toast";
import { InfoServices } from "./infoServices/InfoServices";
import { TbInfoSquareFilled } from "react-icons/tb";
import { CustomService } from "./customService/CustomService";

const URL_SERVER = "http://localhost:4000/";
const FILE_SIZE = 5 * 1024 * 1024;
const TELEGRAM_BOT_TOKEN = "6325976760:AAGBh9bAHF1Ee5kM3dKgaOCSbeagHJFNCRM";

const schema = yup.object({
  firstName: yup.string().required("Name is a required field"),
  lastName: yup.string().required("Name is a required field"),
  phone: yup.string().required("Phone is a required field"),
  email: yup.string().email().required("Email is a required field"),
  comment: yup.string().required("Comments is a required field"),
  file: yup
      .mixed()
      .test("fileSize", "File size is too large", (value: any) => {
        if (value?.length === 0) return true;
        const v = Array.from(value as FileList);
        return v && v[0]?.size <= FILE_SIZE;
      })
      .test("fileCount", "Maximum 5 files allowed", (value) => {
        if (!value) return true;

        const fileArray = Array.isArray(value) ? value : [value];
        const fileCount = fileArray.length;

        return fileCount <= 5;
      }),


  year: yup.string().required("Year is a required field"),
  make: yup.string().required("Make is a required field"),
  model: yup.string().required("Model is a required field"),
  licensePlate: yup.string(),
  state: yup.string(),
  services: yup
      .array()
      .required("At least one service must be selected")
      .min(1, "At least one service must be selected"),
});

export const CustomForm = () => {
  const formAnimation = {
    hidden: {
      y: -100,
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 1,
        ease: "easeOut",
      },
    },
  };

  const {
    watch,
    control,
    handleSubmit,
    register,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      file: [],
      comment: "",
      year: "",
      make: "",
      model: "",
      licensePlate: "",
      state: "",
      services: [],
    },
  });
  const [arrayImages, setArrayImages] = useState<File[]>([] as File[]);

  const botToken = TELEGRAM_BOT_TOKEN;
  const chatId = "-1001806613572"; // Replace with the actual channel username
  const onSubmit = handleSubmit(async (data: any) => {
    try {
      const message = `
      Contact Details:
  
      -First Name: ${data.firstName}
      -Last Name: ${data.lastName}
      -Phone: ${data.phone}
      -Email: ${data.email}

      Vehicle Information:
  
      -Year: ${data.year}
      -Make: ${data.make}
      -Model: ${data.model}
      -License Plate: ${data.licensePlate}
      -State: ${data.state}
  
      Services:
  
      ${data.services.map((service: string) => `- ${service}`).join('\n')}

      Comments:
      (${data.comment})
    `;

      const textFormData = new FormData();
      textFormData.append('chat_id', chatId);
      textFormData.append('text', message);
      textFormData.append('parse_mode', 'markdown');

      if (data.file && data.file.length > 0) {
        const photoArray = Array.from(data.file) as File[];
        const photoFormData = new FormData();
        photoFormData.append('chat_id', chatId);
        photoFormData.append('caption', message);

        photoArray.forEach((photo: File, index: number) => {
          photoFormData.append('photo', photo, `photo_${index}`);
        });

        const response = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
          method: 'POST',
          body: photoFormData,
        });

        if (!response.ok) {
          console.error('Telegram API returned an error for sending photos:', response.statusText);
        } else {
          console.log('Telegram message with text and photos sent successfully');
        }
      } else {
        // If no photos, only send the text
        const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          body: textFormData,
        });

        if (!response.ok) {
          console.error('Telegram API returned an error for sending text:', response.statusText);
        } else {
          console.log('Telegram message with text sent successfully');
        }
      }
    } catch (error) {
      console.error('Error sending Telegram message:', error);
    }
  });





  const selectedPhotos = watch("file") as File[];
  const handleDeletePhoto = (photo: File) => {
    const updatedPhotos = arrayImages.filter((item) => item !== photo);
    setArrayImages(updatedPhotos);
    setValue('file', updatedPhotos);
  };

  useEffect(() => {
    if (selectedPhotos !== undefined && selectedPhotos.length > 0) {
      setArrayImages([...selectedPhotos]);
    }
  }, [selectedPhotos]);
  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const response = await fetch(`https://api.telegram.org/bot${botToken}/getChatMember?chat_id=${chatId}&user_id=${botToken}`);
        const result = await response.json();

        if (result.ok) {
          const status = result.result.status;
          const canSendMedia = status === 'administrator' || status === 'creator';
          console.log(`Бот має дозвіл на відправлення фотографій: ${canSendMedia}`);
        } else {
          console.error('Помилка отримання інформації про користувача бота:', result.description);
        }
      } catch (error) {
        console.error('Помилка зв:');
      }
    };

    checkPermissions();
  }, [botToken, chatId]);

  return (
    // <div className="bg-slate-300 p-10  lg:p-14 border-[#111827] rounded-md shadow-lg hover:shadow-2xl transition duration-200 shadow-slate-600 hover:shadow-[#111827] bg-gradient-to-r from-slate-300 to-slate-400">
    <div className="bg-slate-50 p-10  lg:p-14 border-[#111827] rounded-md shadow-lg hover:shadow-2xl transition duration-200  ">
      <motion.form
        initial="hidden"
        whileInView="visible"
        onSubmit={onSubmit}
        // className="grid grid-cols-1 md:grid-cols-1 gap- overflow-x-hidden"
        viewport={{ once: true }}
      >
        <div className="">
          <p className="border-b-[3px] border-[#111827] py-1 mb-4 text-2xl uppercase text-[#111827]">
            STEP 1. FILL OUT YOUR CONTACT DETAILS
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 overflow-y-hidden">
          {/* first name */}
          <motion.div
            viewport={{ once: true }}
            variants={formAnimation}
            // className="mb-4 "
          >
            <label className="block text-sm font-medium text-gray-900">
              First Name*
              <Controller
                name="firstName"
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder="Write your first name" />
                )}
              />
            </label>
            <p className="text-sm text-red-600">{errors.firstName?.message}</p>
          </motion.div>
          {/* first name */}
          {/* last name */}
          <motion.div
            viewport={{ once: true }}
            variants={formAnimation}
            className=""
          >
            <label className="block text-sm font-medium text-gray-900">
              Last Name*
              <Controller
                name="lastName"
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder="Write your last name" />
                )}
              />
            </label>
            <p className="text-sm text-red-600">{errors.lastName?.message}</p>
          </motion.div>
          {/* last name */}
          {/* Phone*/}
          <motion.div
            viewport={{ once: true }}
            className=""
            variants={formAnimation}
          >
            <label className="block text-sm font-medium text-gray-900">
              Phone*
              <PhoneInputWithCountry
                className="phoneInputCustom focus:outline-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-zinc-800 focus:border-zinc-800 block w-full p-2.5 "
                control={control}
                rules={{ required: true, validate: isPossiblePhoneNumber }}
                defaultCountry="US"
                autoComplete="tel"
                displayInitialValueAsLocalNumber
                defaultValue=""
                international
                withCountryCallingCode
                name="phone"
                metadata={metadata}
              />
            </label>
            <p className="text-sm text-red-600">{errors.phone?.message}</p>
          </motion.div>
          {/* Phone*/}
          {/* Email*/}
          <motion.div
            viewport={{ once: true }}
            className=""
            variants={formAnimation}
          >
            <label className="block text-sm font-medium text-gray-900">
              Email*
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder="Write your email" />
                )}
              />
            </label>
            <p className="text-sm text-red-600">{errors.email?.message}</p>
          </motion.div>
          {/* Email*/}
        </div>

        {/* ------------------------------- */}
        {/* -------auto data----------------- */}
        <div className="">
          <p className="border-b-[3px] border-[#111827] py-1 mb-4 text-2xl uppercase text-[#111827]">
            STEP 2. YOUR VEHICLE INFORMATION
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10  overflow-y-hidden">
          {/* year */}
          <motion.div
            viewport={{ once: true }}
            variants={formAnimation}
            className=""
          >
            <label className="block text-sm font-medium text-gray-900">
              Year*
              <Controller
                name="year"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    datas={years}
                    {...field}
                    placeholder="Write your first name"
                  />
                )}
              />
            </label>
            <p className="text-sm text-red-600">{errors.year?.message}</p>
          </motion.div>
          {/* year */}

          {/* make */}
          <motion.div
            viewport={{ once: true }}
            variants={formAnimation}
            // className="mb-4 "
          >
            <label className="block text-sm font-medium text-gray-900">
              Make*
              <Controller
                name="make"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    datas={makes}
                    {...field}
                    placeholder="Choose your make"
                  />
                )}
              />
            </label>
            <p className="text-sm text-red-600">{errors.make?.message}</p>
          </motion.div>
          {/* make */}
          {/* model */}
          <motion.div
            viewport={{ once: true }}
            variants={formAnimation}
            // className="mb-4 "
          >
            <label className="block text-sm font-medium text-gray-900">
              Model*
              <Controller
                name="model"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    datas={
                      watch("make") ? models[watch("make")] : models.default
                    }
                    {...field}
                    placeholder="Choose your make"
                  />
                )}
              />
            </label>
            <p className="text-sm text-red-600">{errors.model?.message}</p>
          </motion.div>
          {/*----------------------- license plate----------------- /> */}
          <motion.div
            viewport={{ once: true }}
            variants={formAnimation}
            // className="grid grid-cols-[65%_auto] gap-4"
          >
            <label className="block text-sm font-medium text-gray-900">
              License Plate
              <Controller
                name="licensePlate"
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder="Write your license plate" />
                )}
              />
            </label>
            <p className="text-sm text-red-600">
              {errors.licensePlate?.message}
            </p>
          </motion.div>
          <motion.div
            viewport={{ once: true }}
            variants={formAnimation}
            // className="mb-4 "
          >
            <label className="block text-sm font-medium text-gray-900">
              State
              <Controller
                name="state"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    datas={states}
                    {...field}
                    placeholder="Choose your make"
                  />
                )}
              />
            </label>
            <p className="text-sm text-red-600">{errors.state?.message}</p>
          </motion.div>
          {/*----------------------- license plate----------------- /> */}
        </div>
        {/* -------auto data----------------- */}

        {/* -------------------------------services------------------------- */}
        <div className="">
          <p className="border-b-[3px] border-[#111827] py-1 mb-4 text-2xl uppercase text-[#111827]">
            STEP 3. SELECT YOUR SERVICES
          </p>
        </div>
        <div className=" overflow-y-hidden grid grid-cols-1 md:grid-cols-3">
          <motion.div
            viewport={{ once: true }}
            variants={formAnimation}
            className=" col-span-1 md:col-span-3  mb-6"
          >
            <div className="block text-sm font-medium text-gray-900">
              Services*
              <ul className="grid w-full gap-6 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
                {services.map((service: IService) => {
                  return (
                    <Controller
                      key={service.value}
                      name="services"
                      control={control}
                      render={({ field }) => (
                        <CustomService
                          {...field}
                          service={service}
                          register={register}
                        />
                      )}
                    />
                  );
                })}
              </ul>
            </div>
            <p className="text-sm text-red-600">{errors.services?.message}</p>
          </motion.div>
          {/* -------------------------------services------------------------- */}
          {/* -------------------------------comment-------------------------- */}
          <motion.div
            viewport={{ once: true }}
            className="mb-4 col-span-1 md:col-span-3"
            variants={formAnimation}
          >
            <label className="block text-sm font-medium text-gray-900">
              Your message
              <Controller
                name="comment"
                control={control}
                render={({ field }) => (
                  <CustomTextArea {...field} placeholder="Write your comment" />
                )}
              />
            </label>

            <p className="text-sm text-red-600">{errors.comment?.message}</p>
          </motion.div>
          {/* -------------------------------comment-------------------------- */}
          {/* --------------images----------------- */}
          <motion.div
            viewport={{ once: true }}
            className="block col-span-1 md:col-span-1 mb-16"
            variants={formAnimation}
          >
            <label className="block text-sm font-medium text-gray-900">
              Upload File
              <div className="overflow-hidden flex focus:outline-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-zinc-800 focus:border-zinc-800 w-full">
                <input
                  type="file"
                  {...register("file")}
                  className="absolute opacity-0 w-[164px] left-0"
                  multiple
                ></input>
                <div className="cursor-pointer relative box-border h-full font-normal text-sm text-center border-r-[1px] border-[#111827] text-slate-50 bg-[#111827] w-[240px] p-2.5 mr-4">
                  Upload File{" "}
                </div>
                <div className="flex items-center w-full">
                  {" "}
                  {arrayImages.length > 0 ? (
                    <span className="text-[#111827]">
                      You download {arrayImages.length} image
                    </span>
                  ) : (
                    <span className="text-sm text-gray-400">
                      Upload your file
                    </span>
                  )}
                </div>
              </div>
            </label>

            {arrayImages.map((photo: File, index: number) => (
                <div className="relative h-[80px] w-[80px] rounded-md" key={index}>
                  <Image
                      src={URL.createObjectURL(photo)}
                      alt={`Фото ${index}`}
                      width={80}
                      height={80}
                      className="h-[80px] w-[80px] rounded-md shadow-md"
                  />
                  <div
                      className="absolute top-1 right-1 p-1 backdrop-blur-[4px] rounded-md cursor-pointer"
                      onClick={() => handleDeletePhoto(photo)}
                  >
                    <AiOutlineClose color="white" />
                  </div>
                </div>
            ))}

            <p className="text-sm text-red-600">{errors.file?.message}</p>
          </motion.div>
          {/* --------------images----------------- */}
        </div>

        <motion.div
          viewport={{ once: true }}
          variants={formAnimation}
          className="flex items-center justify-center mb-4 col-span1 md:col-span-3"
        >
          <Button
            type="submit"
            handleClick={() => {}}
            cn="w-full"
            outline={false}
          >
            Submit
          </Button>
        </motion.div>
      </motion.form>
    </div>
  );
};
