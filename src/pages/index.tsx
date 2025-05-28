"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Check, Truck, AlertCircle } from "lucide-react";
import CepChecker from "@/components/check-cep";
import Utils from "@/utils/utils";

const EXPIRY_TIME = 15 * 60 * 1000;

interface ProductData {
  id: number;
  title: string;
  options: string[];
  values: string[][];
  variants: Variant[];
  image_url: string;
  images: {
    id: number;
    product_id: number;
    src: string;
  }[];
}

interface Variant {
  id: number;
  product_id: number;
  price: string;
  values: string[];
  image_id: number;
  inventory_quantity: number;
  image_url: string;
}

export default function ProductPage() {
  const [product, setProduct] = useState<ProductData | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [errorStock, setErrorStock] = useState<string>("");

  useEffect(() => {
    fetch(
      "https://empreender.nyc3.cdn.digitaloceanspaces.com/static/teste-prod-1.json"
    )
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        const initialColor =
          Utils.getWithExpiry("selectedColor") || data.values[0][0];
        const initialSize =
          Utils.getWithExpiry("selectedSize") || data.values[1][0];
        setSelectedColor(initialColor);
        setSelectedSize(initialSize);
        setSelectedImage(data.image_url);
      });
  }, []);

  useEffect(() => {
    if (!product) return;
    const variant = product.variants.find(
      (v) => v.values[0] === selectedColor && v.values[1] === selectedSize
    );
    if (variant) {
      setSelectedImage(variant.image_url);
      checkStock(variant);
    }
  }, [selectedColor, selectedSize, product]);

  function handleChangeColor(color: string) {
    setSelectedColor(color);
    Utils.setWithExpiry("selectedColor", color, EXPIRY_TIME);
    checkStockBySelection(color, selectedSize);
  }

  function handleChangeSize(size: string) {
    setSelectedSize(size);
    Utils.setWithExpiry("selectedSize", size, EXPIRY_TIME);
    checkStockBySelection(selectedColor, size);
  }

  function checkStockBySelection(color: string, size: string) {
    if (!product) return;
    const variant = product.variants.find(
      (v) => v.values[0] === color && v.values[1] === size
    );
    if (variant) {
      checkStock(variant);
      setSelectedImage(variant.image_url);
    }
  }

  function checkStock(variant: Variant) {
    if (variant.inventory_quantity <= 0) {
      setErrorStock("Produto sem estoque disponível.");
    } else {
      setErrorStock("");
    }
  }

  if (!product) {
    return <div className="p-8">Carregando...</div>;
  }

  const variantSelected =
    product.variants.find(
      (v) => v.values[0] === selectedColor && v.values[1] === selectedSize
    ) || product.variants[0];

  const price = variantSelected.price;

  return (
    <div className="container mx-auto px-4 py-8 bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Imagem principal */}
        <div className="flex flex-col gap-4">
          <div className="relative w-full aspect-square rounded-lg overflow-hidden border border-neutral-200">
            <Image
              src={selectedImage || "/placeholder.svg"}
              alt={product.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Miniaturas */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {product.variants.map((variant) => (
              <button
                key={variant.id + variant.values.join("-")}
                onClick={() => {
                  setSelectedColor(variant.values[0]);
                  setSelectedSize(variant.values[1]);
                  setSelectedImage(variant.image_url);
                  Utils.setWithExpiry(
                    "selectedColor",
                    variant.values[0],
                    EXPIRY_TIME
                  );
                  Utils.setWithExpiry(
                    "selectedSize",
                    variant.values[1],
                    EXPIRY_TIME
                  );
                  checkStock(variant);
                }}
                className={`relative w-20 h-20 rounded-md overflow-hidden border-2 ${
                  selectedImage === variant.image_url
                    ? "border-neutral-500"
                    : "border-neutral-200"
                }`}
              >
                <Image
                  src={variant.image_url}
                  alt={`Miniatura ${variant.values.join(" ")}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Detalhes */}
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">
              {product.title}
            </h1>
            <p className="text-2xl font-semibold mt-2 text-neutral-900">
              R$ {price.replace(".", ",")}
            </p>
          </div>

          {/* Cor */}
          <div>
            <h2 className="text-lg font-medium mb-2 text-neutral-900">Cor</h2>
            <div className="flex flex-wrap gap-2">
              {product.values[0].map((color) => (
                <button
                  key={color}
                  onClick={() => handleChangeColor(color)}
                  className={`w-12 h-12 flex items-center justify-center rounded-full border-2 relative ${
                    selectedColor === color
                      ? "border-neutral-500"
                      : "border-neutral-200"
                  } bg-neutral-100`}
                >
                  {color}
                  {selectedColor === color && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <Check className="w-5 h-5 text-black" />
                    </span>
                  )}
                </button>
              ))}
            </div>
            <p className="mt-1 text-sm text-neutral-500">
              Selecionado: {selectedColor}
            </p>
          </div>

          {/* Tamanho */}
          <div>
            <h2 className="text-lg font-medium mb-2 text-neutral-900">
              Tamanho
            </h2>
            <div className="flex flex-wrap gap-2">
              {product.values[1].map((size) => (
                <button
                  key={size}
                  onClick={() => handleChangeSize(size)}
                  className={`w-12 h-12 flex items-center justify-center rounded-md border ${
                    selectedSize === size
                      ? "border-neutral-900 bg-neutral-900 text-white"
                      : "border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-100"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            <p className="mt-1 text-sm text-neutral-500">
              Selecionado: {selectedSize}
            </p>
          </div>

          {/* Frete */}
          <div className="mt-4 p-4 border border-neutral-200 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Truck className="w-5 h-5 text-neutral-700" />
              <h2 className="text-lg font-medium text-neutral-900">
                Calcular frete e prazo de entrega
              </h2>
            </div>
            <CepChecker />
            {errorStock && (
              <div className="mt-3 flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                {errorStock}
              </div>
            )}
          </div>

          <button
            disabled={!!errorStock}
            className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
              errorStock
                ? "bg-neutral-300 text-neutral-600 cursor-not-allowed"
                : "bg-neutral-900 text-white hover:bg-neutral-800"
            }`}
          >
            Finalizar compra
          </button>
        </div>
      </div>
    </div>
  );
}
