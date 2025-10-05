import { useCallback, useState } from "react";

type FormFields<T> = {
  [K in keyof T]: string;
};

export function useFormFields<T extends Record<string, string>>(initialValues: FormFields<T>) {
  const [fields, setFields] = useState<FormFields<T>>(initialValues);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(name, value);
    setFields((prev) => ({
      ...prev,
      [name]: value,
    }));
  },[])


  const handleClear =  useCallback(() => {
    setFields({...initialValues});
  },[initialValues]);
  return {
    fields,
    onFieldChange: handleChange,
    onClear: handleClear,
    setFields,
  };
}
