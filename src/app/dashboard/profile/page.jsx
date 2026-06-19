import ProfileClient from "./ProfileClient";

// পরবর্তীতে better-auth এর session থেকে এই ডেটা আসবে
async function getUserProfile() {
  return {
    name: "Sakib Ahmed Sihab",
    email: "shihab@recipehub.com",
    image: "",
    bio: "Frontend Developer by day, passionate home chef by night. I love building web apps with React and experimenting with new recipes in my kitchen!",
  };
}

export default async function Profile() {
  const initialProfile = await getUserProfile();

  return <ProfileClient initialProfile={initialProfile} />;
}
