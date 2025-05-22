"use client";

import Utils from "@/utils/utils";
import { Loader2 } from "lucide-react";
import type React from "react";

import { useEffect, useState } from "react";

interface CepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

export default function CepChecker() {
  const [cep, setCep] = useState("");
  const [address, setAddress] = useState<CepResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const EXPIRY_TIME = 15 * 60 * 1000;

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");

    if (value.length > 8) {
      value = value.slice(0, 8);
    }

    if (value.length > 5) {
      value = value.slice(0, 5) + "-" + value.slice(5);
    }

    setCep(value);

    if (value.length < 9) {
      setAddress(null);
      setError("");
    }
  };

  const checkCep = async () => {
    const cleanCep = cep.replace(/\D/g, "");

    if (cleanCep.length !== 8) {
      setError("CEP deve conter 8 dígitos");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `https://viacep.com.br/ws/${cleanCep}/json/`
      );
      const data: CepResponse = await response.json();

      if (data.erro) {
        setError("CEP não encontrado");
        setAddress(null);
      } else {
        Utils.setWithExpiry("cep", data, EXPIRY_TIME);
        setAddress(data);
      }
    } catch (err) {
      setError("Erro ao consultar o CEP. Tente novamente.");
      setAddress(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const data = Utils.getWithExpiry("cep");

    if (data) {
      setAddress(data);
      console.log(data);
      setCep(data?.cep);
    }
  }, []);

  return (
    <div>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={cep}
            onChange={handleCepChange}
            placeholder="Digite seu CEP"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 text-black"
            maxLength={9}
          />
        </div>
        <button
          onClick={checkCep}
          disabled={loading || cep.replace(/\D/g, "").length !== 8}
          className="px-4 py-2 bg-gray-800 text-white rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center min-w-24"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Calcular"}
        </button>
      </div>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      {address && (
        <div className="mt-3 p-3 bg-gray-50 rounded-md">
          <h3 className="font-medium text-gray-900 mb-1">
            Endereço encontrado:
          </h3>
          <p className="text-gray-700">
            {address.logradouro}
            {address.complemento ? `, ${address.complemento}` : ""}
            <br />
            {address.bairro} - {address.localidade}/{address.uf}
            <br />
            CEP: {address.cep}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <p className="text-sm text-green-700">
              Entrega disponível para este endereço
            </p>
          </div>
          <p className="mt-1 text-sm text-gray-600">
            Prazo de entrega: 3-5 dias úteis
          </p>
        </div>
      )}

      <p className="mt-2 text-xs text-gray-500">
        Não sabe seu CEP?{" "}
        <a
          href="https://buscacepinter.correios.com.br/app/endereco/index.php"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-700 underline"
        >
          Consulte aqui
        </a>
      </p>
    </div>
  );
}
