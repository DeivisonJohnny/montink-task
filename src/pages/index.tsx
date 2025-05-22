"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Check, Truck } from "lucide-react";
import CepChecker from "@/components/check-cep";

const fetchProduct = (): Promise<typeof product | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(product);
    }, 1500);
  });
};

const product = {
  name: "Camisa Feminina Casual",
  price: 299.9,
  description:
    "Camisa feminina de tecido leve, confortável e elegante. Perfeita para compor looks modernos no dia a dia ou em ocasiões especiais. Modelagem que valoriza o corpo e garante muito estilo.",
  variants: [
    {
      colorId: 1,
      colorName: "Preto",
      colorValue: "black",
      image: "/images/modelo-preto.jpg",
    },
    {
      colorId: 2,
      colorName: "Branco",
      colorValue: "white",
      image: "/images/modelo-branco.jpg",
    },
    {
      colorId: 3,
      colorName: "Azul",
      colorValue: "blue",
      image: "/images/modelo-azul.jpg",
    },
    {
      colorId: 4,
      colorName: "Vermelho",
      colorValue: "red",
      image: "/images/modelo-vermelho.jpg",
    },
  ],
  sizes: [
    { id: 1, name: "38" },
    { id: 2, name: "39" },
    { id: 3, name: "40" },
    { id: 4, name: "41" },
    { id: 5, name: "42" },
  ],
};

export default function ProductPage() {
  const [data, setData] = useState<typeof product | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<number | null>(null);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);

  useEffect(() => {
    fetchProduct().then((res) => {
      setData(res);
      if (res) {
        setSelectedImage(res.variants[0].image);
        setSelectedColor(res.variants[0].colorId);
        setSelectedSize(res.sizes[0].id);
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <p className="text-lg text-neutral-500">Carregando produto...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <p className="text-lg text-red-500">
          Produto não encontrado ou erro ao carregar.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col gap-4">
          <div className="relative w-full aspect-square rounded-lg overflow-hidden border border-neutral-200">
            <Image
              src={selectedImage || "/placeholder.svg"}
              alt={data.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {data.variants.map((variant, index) => (
              <button
                key={index}
                onClick={() => {
                  setSelectedImage(variant.image);
                  setSelectedColor(variant.colorId);
                }}
                className={`relative w-20 h-20 rounded-md overflow-hidden border-2 ${
                  selectedImage === variant.image
                    ? "border-neutral-500"
                    : "border-neutral-200"
                }`}
              >
                <Image
                  src={variant.image || "/placeholder.svg"}
                  alt={`Miniatura ${variant.colorName}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">{data.name}</h1>
            <p className="text-2xl font-semibold mt-2 text-neutral-900">
              R$ {data.price.toFixed(2).replace(".", ",")}
            </p>
          </div>

          <p className="text-neutral-600">{data.description}</p>

          <div>
            <h2 className="text-lg font-medium mb-2 text-neutral-900">Cor</h2>
            <div className="flex flex-wrap gap-2">
              {data.variants.map((variant) => (
                <button
                  key={variant.colorId}
                  onClick={() => {
                    setSelectedColor(variant.colorId);
                    setSelectedImage(variant.image);
                  }}
                  className={`relative w-12 h-12 rounded-full border-2 ${
                    selectedColor === variant.colorId
                      ? "border-neutral-500"
                      : "border-neutral-200"
                  }`}
                  style={{ backgroundColor: variant.colorValue }}
                  aria-label={variant.colorName}
                >
                  {selectedColor === variant.colorId && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <Check
                        className={`w-6 h-6 ${
                          ["white", "yellow"].includes(variant.colorValue)
                            ? "text-black"
                            : "text-white"
                        }`}
                      />
                    </span>
                  )}
                </button>
              ))}
            </div>
            <p className="mt-1 text-sm text-neutral-500">
              Selecionado:{" "}
              {data.variants.find((v) => v.colorId === selectedColor)
                ?.colorName || ""}
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium mb-2 text-neutral-900">
              Tamanho
            </h2>
            <div className="flex flex-wrap gap-2">
              {data.sizes.map((size) => (
                <button
                  key={size.id}
                  onClick={() => setSelectedSize(size.id)}
                  className={`w-12 h-12 flex items-center justify-center rounded-md border ${
                    selectedSize === size.id
                      ? "border-neutral-900 bg-neutral-900 text-white"
                      : "border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-100"
                  }`}
                >
                  {size.name}
                </button>
              ))}
            </div>
            <p className="mt-1 text-sm text-neutral-500">
              Selecionado: {data.sizes.find((s) => s.id === selectedSize)?.name}
            </p>
          </div>

          <div className="mt-4 p-4 border border-neutral-200 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Truck className="w-5 h-5 text-neutral-700" />
              <h2 className="text-lg font-medium text-neutral-900">
                Calcular frete e prazo de entrega
              </h2>
            </div>
            <CepChecker />
          </div>

          <button className="w-full py-3 px-4 bg-neutral-900 text-white rounded-md font-medium hover:bg-neutral-800 transition-colors">
            Finalizar compra
          </button>
        </div>
      </div>
    </div>
  );
}
