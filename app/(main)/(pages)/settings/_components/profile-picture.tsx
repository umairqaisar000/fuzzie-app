/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
// import UploadCareButton from "./uploadcare-button"
import '@uploadcare/react-uploader/core.css'
import { FileUploaderMinimal } from '@uploadcare/react-uploader/next'

type Props = {
    userImage: string | null
    onDelete?: any
    onUpload?: (filePath: string) => any
}

const ProfilePicture = ({ userImage, onDelete, onUpload }: Props) => {
    const router = useRouter()

    const onRemoveProfileImage = async () => {
        const response = await onDelete()
        if (response) {
            router.refresh()
        }
    }

    const handleUploadSuccess = async (event: any) => {
        console.log(event);
        if (onUpload && event.cdnUrl) {
            await onUpload(event.cdnUrl);
            router.refresh();
        }
    };

    return (
        <div className="flex flex-col">
            <p className="text-lg text-white">Profile Picture</p>
            <div className="flex h-[30vh] flex-col items-center justify-center">
                {userImage ? (
                    <>
                        <div className="relative h-full w-2/12">
                            <Image
                                src={userImage}
                                alt="User_Image"
                                fill
                            />
                        </div>
                        <Button
                            onClick={onRemoveProfileImage}
                            className="bg-transparent text-white/70 hover:bg-transparent hover:text-white"
                        >
                            <X /> Remove Logo
                        </Button>
                    </>
                ) : (
                    <div>
                        <FileUploaderMinimal
                            sourceList="local, url, camera, dropbox"
                            classNameUploader="uc-dark uc-purple"
                            pubkey="ccd4cb82f9778954e964"
                            onFileUploadSuccess={handleUploadSuccess}
                        />
                    </div>
                    // <UploadCareButton onUpload={onUpload} />
                )}
            </div>
        </div>
    )
}

export default ProfilePicture