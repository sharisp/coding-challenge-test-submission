import React from "react";

import Address from "@/components/Address/Address";
import AddressBook from "@/components/AddressBook/AddressBook";
import Button from "@/components/Button/Button";
import Radio from "@/components/Radio/Radio";
import Section from "@/components/Section/Section";
import useAddressBook from "@/hooks/useAddressBook";

import { Address as AddressType } from "./types";

import transformAddress, { RawAddressModel } from "./core/models/address";
import Form from "@/components/Form/Form";
import ErrorMessage from "@/components/ErrorMsg/ErrorMsg";
import { useFormFields } from "@/hooks/useFormFields";
import { selectAddress } from "./core/reducers/addressBookSlice";
import { useAppSelector } from "./core/store/hooks";

function App() {
  /**
   * Form fields states
   * TODO(finish): Write a custom hook to set form fields in a more generic way:
   * - Hook must expose an onChange handler to be used by all <InputText /> and <Radio /> components
   * - Hook must expose all text form field values, like so: { postCode: '', houseNumber: '', ...etc }
   * - Remove all individual React.useState
   * - Remove all individual onChange handlers, like handlePostCodeChange for example
   */

  const { fields, onFieldChange, onClear, setFields } = useFormFields({
    postCode: "",
    houseNumber: "",
    firstName: "",
    lastName: "",
    selectedAddress: "",
  });


  const addressesSelector = useAppSelector(selectAddress);
  const [loading, setLoading] = React.useState(false);
  /**
   * Results states
   */
  const [error, setError] = React.useState<undefined | string>(undefined);
  const [addresses, setAddresses] = React.useState<AddressType[]>([]);
  /**
   * Redux actions
   */
  const { addAddress } = useAddressBook();


  /** TODO(FINISHED): Fetch addresses based on houseNumber and postCode using the local BE api
   * - Example URL of API: ${process.env.NEXT_PUBLIC_URL}/api/getAddresses?postcode=1345&streetnumber=350
   * - Ensure you provide a BASE URL for api endpoint for grading purposes!
   * - Handle errors if they occur
   * - Handle successful response by updating the `addresses` in the state using `setAddresses`
   * - Make sure to add the houseNumber to each found address in the response using `transformAddress()` function
   * - Ensure to clear previous search results on each click
   * - Bonus: Add a loading state in the UI while fetching addresses
   */
  const handleAddressSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    //setSelectedAddress("");
    setFields({ ...fields, selectedAddress: "" });
    setAddresses([]);
    setError(undefined);
    setLoading(true);
    console.log(fields.houseNumber);
    try {
      const url = `${process.env.NEXT_PUBLIC_URL}/api/getAddresses?postcode=${fields.postCode}&streetnumber=${fields.houseNumber}`;
      const response = await fetch(url);

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        setError(errData?.errormessage ?? `Error: ${response.status} ${response.statusText}`);
        return;
      }

      const data = await response.json();
      console.log(data);
      if (data.status === "error") {
        setError(data.errormessage ?? "Unknown error");
        return;
      }


      const transformedAddresses: AddressType[] = (data.details ?? []).map((addr: RawAddressModel, index: number) => {
        const transformed = transformAddress(addr);
        return { ...transformed, houseNumber: fields.houseNumber };
      });

      setAddresses(transformedAddresses);
    } catch (err) {
      setError("Failed to fetch addresses");
    } finally {
      setLoading(false);
    }

  };

  /** TODO(FINISHED): Add basic validation to ensure first name and last name fields aren't empty
   * Use the following error message setError("First name and last name fields mandatory!")
   */

  const handlePersonSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError(undefined);
    if (!fields.firstName.trim() || !fields.lastName.trim()) {
      setError("First name and last name fields mandatory!");
      return;
    }

    if (!fields.selectedAddress || !addresses.length) {
      setError(
        "No address selected, try to select an address or find one if you haven't"
      );
      return;
    }
    console.log(fields.selectedAddress, addresses);
    const foundAddress = addresses.find(
      (address) => address.id === fields.selectedAddress
    );

    if (!foundAddress) {
      setError("Selected address not found");
      return;
    }

    addAddress({ ...foundAddress, firstName: fields.firstName, lastName: fields.lastName });
  };
  const ClearAll = () => {
    setAddresses([]);
    setError(undefined);
    setLoading(false);
    onClear();
  }
  return (
    <main>
      <Section>
        <h1>
          Create your own address book!
          <br />
          <small>
            Enter an address by postcode add personal info and done! 👏
          </small>
        </h1>
        {/* TODO(finish): Create generic <Form /> component to display form rows, legend and a submit button  */}
        <Form
          label="🏠 Find an address"
          onFormSubmit={handleAddressSubmit}
          submitText="Find"
          loading={loading}
          formEntries={[
            {
              name: "postCode",
              placeholder: "Post Code",
              value: fields.postCode,
              onChange: onFieldChange
            },
            {
              name: "houseNumber",
              placeholder: "House number",
              value: fields.houseNumber,
              onChange: onFieldChange
            }
          ]}
        />


        {addresses.length > 0 &&
          addresses.map((address) => {
            return (
              <Radio
                name="selectedAddress"
                id={address.id}
                key={address.id}
                onChange={onFieldChange}
                disabled={addressesSelector.length > 0 && addressesSelector.some((addr: AddressType) => addr.id === address.id)}
              >
                <Address {...address} />
              </Radio>
            );
          })}
        {/* TODO(finish): Create generic <Form /> component to display form rows, legend and a submit button  */}


        {fields.selectedAddress && (
          <Form
            label="✏️ Add personal info to address"
            onFormSubmit={handlePersonSubmit}
            submitText="Add to addressbook"
            loading={loading}
            formEntries={[
              {
                name: "firstName",
                placeholder: "First name",
                value: fields.firstName,
                onChange: onFieldChange
              },
              {
                name: "lastName",
                placeholder: "Last name",
                value: fields.lastName,
                onChange: onFieldChange
              }
            ]}
          />
        )}
        {/* TODO(finish): Create an <ErrorMessage /> component for displaying an error message */}
        {/* {error && <div className={styles.error}>{error}</div>} */}

        <ErrorMessage message={error} />
        {/* TODO: Add a button to clear all form fields. 
        Button must look different from the default primary button, see design. 
        Button text name must be "Clear all fields"
        On Click, it must clear all form fields, remove all search results and clear all prior
        error messages
        */}
        <Button variant="secondary" onClick={() => ClearAll()}>Clear all fields</Button>
      </Section>

      <Section variant="dark">
        <AddressBook />
      </Section>
    </main>
  );
}

export default App;
