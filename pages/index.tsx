import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { SubmitHandler, useForm } from "react-hook-form";
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";

interface Records {
  _id: string;
  person_name: string;
  person_number: number;
}

export const getServerSideProps: GetServerSideProps = async () => {
  let responseData = await axios({
    method: "post",
    url: "https://data.mongodb-api.com/app/data-hdqqt/endpoint/data/beta/action/find",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Request-Headers": "*",
      "api-key":
        "5yOxWgSuGjk8CVY28ipfhsNJJosstEcG9asNQQG7SthaApNwE7qv3EBbWqkWwkHN",
    },
    data: {
      collection: "records",
      database: "myFirstDatabase",
      dataSource: "cluster-tutorial",
    },
  })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error.message);
    });

  return {
    props: { data: responseData }, // will be passed to the page component as props
  };
};

const Home: NextPage = ({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [user, setUser] = useState<Records[]>(data.documents);

  const { register, handleSubmit, reset } = useForm<Records>();

  const handleLoadData = useCallback(() => {
    axios({
      method: "get",
      url: "https://secret-badlands-96838.herokuapp.com/record",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    }).then((response) => setUser(response.data));
  }, []);

  const handleAddData = useCallback(
    (value: Records) => {
      console.log(value);
      axios({
        method: "post",
        url: "https://secret-badlands-96838.herokuapp.com/record/add",
        data: {
          person_name: value.person_name,
          person_number: value.person_number,
        },
      })
        .then(() => {
          reset({ person_name: undefined, person_number: undefined });
          handleLoadData();
        })
        .catch((error) => console.log(error.message));
    },
    [handleLoadData, reset]
  );

  const onSubmit: SubmitHandler<Records> = useCallback(
    (data) => {
      handleAddData(data);
    },
    [handleAddData]
  );

  return (
    <div>
      <h1 className="text-4xl">List of person</h1>
      <p>added from mongodB</p>
      {user.map((item) => {
        return (
          <div key={item._id} className="text-xl my-4">
            <div className="flex items-center">
              <p>Name: {item.person_name}</p>
              <p className="ml-3">Number: {item.person_number}</p>
            </div>
          </div>
        );
      })}
      <h1>Input other name</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          {...register("person_name", { required: true })}
          type="text"
          placeholder="Name"
          className="focus:outline-black bg-red-300"
        />

        <input
          {...register("person_number", { required: true })}
          type="text"
          placeholder="Number"
          className="ml-3 bg-orange-200"
        />
        <button
          className="bg-black text-white ml-4 px-8 py-2 rounded"
          type="submit"
        >
          Add it !
        </button>
        <h1>Hello World</h1>
      </form>
    </div>
  );
};

export default Home;
