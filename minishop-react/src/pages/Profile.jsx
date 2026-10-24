import AuthorProfile from "../components/Profile";

function Profile() {
  return (
    <section className="py-10 sm:py-14" aria-labelledby="profile-title">
      <h1 id="profile-title" className="text-2xl font-medium">Profile</h1>
      <AuthorProfile
        studentId="67051099"
        name="Ratchatapong Atteephok"
        university="KING MONGKUT'S INSTITUTE OF TECHNOLOGY LADKRABANG"
      />
    </section>
  );
}

export default Profile;
