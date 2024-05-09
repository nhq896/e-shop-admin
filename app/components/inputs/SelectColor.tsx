"use client";

import { ImageType } from "@/app/add-products/AddProductForm";
import { useCallback, useEffect, useState } from "react";
import SelectImage from "./SelectImage";
import Button from "../Button";

interface SelectColorProps {
  item: ImageType;
  addImageToState: (value: ImageType) => void;
  removeImageFromState: (value: ImageType) => void;
  isProductCreated?: boolean;
  isProductEdited?: boolean;
  isEditMode?: boolean;
}

const SelectColor: React.FC<SelectColorProps> = ({
  item,
  addImageToState,
  removeImageFromState,
  isProductCreated,
  isProductEdited,
  isEditMode,
}) => {
  const [isSelected, setIsSelected] = useState(false);
  const [file, setFile] = useState<File | string | null>(null);
  const [quantity, setQuantity] = useState<string>("0");

  useEffect(() => {
    // console.log("item", item);
    if (typeof item.image === "string") {
      setIsSelected(true);
      setQuantity("" + item.quantity);
      setFile(item.image);
    }
  }, []);

  useEffect(() => {
    if (isProductCreated) {
      setIsSelected(false);
      setFile(null);
    }
  }, [isProductCreated]);

  useEffect(() => {
    if (isEditMode) {
      setIsSelected(false);
      setFile(null);
    }
  }, [isEditMode]);

  const handleFileChange = useCallback((value: File) => {
    setFile(value);
    addImageToState({ ...item, image: value });
  }, []);

  const handleCheck = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSelected(e.target.checked);

    if (!e.target.checked) {
      setFile(null);
      setQuantity("0");
      removeImageFromState(item);
    }
  }, []);

  function getfilename(filename: string) {
    const i = filename.indexOf("product%2F") + 9;
    const j = filename.indexOf("?alt");
    let res = filename.slice(i, j).split("-")[1];
    return res;
  }

  return (
    <div className="grid grid-cols-1 overflow-y-auto border-b-[1.2px] border-slate-200 items-center p-2">
      <div className="flex flex-row gap-2 items-center h-[60px] justify-between">
        <input
          type="checkbox"
          id={item.color}
          checked={isSelected}
          onChange={handleCheck}
          className="cursor-pointer"
        />
        <label
          htmlFor={item.color}
          className="font-medium cursor-pointer flex-1"
        >
          {item.color}
        </label>
        {isSelected && (
          <div className="text-sm flex items-center gap-2">
            quantity:{" "}
            <input
              type="number"
              id="imageQuantity"
              onChange={(e: any) => {
                setQuantity(e.target.value);
                item.quantity = parseInt(e.target.value ?? 0);
                // console.log("q", item.quantity);
                // console.log(e.target.value);
              }}
              value={quantity}
              className="outline-none justify-end border-2 rounded border-slate-500 focus:border-slate-600 text-sm h-5 w-16 py-[2px] box-content"
            />
          </div>
        )}
      </div>
      <>
        {isSelected && !file && (
          <div className="col-span-2 text-center">
            <SelectImage item={item} handleFileChange={handleFileChange} />
          </div>
        )}

        {file && (
          <div className="flex flex-row gap-2 text-sm col-span-2 items-center justify-between">
            <p className="truncate">
              {typeof file !== "string" ? file?.name : getfilename(file)}
            </p>
            <div className="w-[70px]">
              <Button
                label="Cancel"
                small
                outline
                onClick={() => {
                  setFile(null);
                  removeImageFromState(item);
                }}
              />
            </div>
          </div>
        )}
      </>
    </div>
  );
};

export default SelectColor;
