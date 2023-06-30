'use client'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { storeFiles } from "@/lib/helper";
import { useState } from "react";

export default function TestPage() {
    const [image, setImage] = useState<any>();

    const acceptedFileTypes = '.jpg, .jpeg, .png';
    const handleFileChange = (files: any) => {
        if (files) {
            if (files.size > 15000000) {
                alert("File size must be under 15MB!");
            } else {
                setImage(files);
            }
        }
    };
    const uploadFile = async () => {
        try {
            console.log(image)
            let url = await storeFiles(image)
            console.log(url)
        } catch (err) {
            console.log(err)
        }

    }

    return (
        <div>
            <Input
                type='file'
                accept={acceptedFileTypes}
                className="mt-1"
                // value={image? image.name : ''}
                onChange={(e) => handleFileChange(e.target.files)}
            />
            <Button onClick={uploadFile}>
                Upload
            </Button>
        </div>
    )
}