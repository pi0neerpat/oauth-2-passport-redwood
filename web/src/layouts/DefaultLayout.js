import { useAuth } from '@redwoodjs/auth'

const DefaultLayout = ({ children }) => {
  const { logIn, logOut } = useAuth()

  const onClick = (e) => {
    if (e.target.id === 'login') logIn()
    if (e.target.id === 'logout') logOut()
  }

  let userMetadata = {}
  try {
    userMetadata = JSON.parse(localStorage.getItem('chess_com_auth_token'))
  } catch (e) {
    console.log('User is not logged in')
  }
  console.log(userMetadata)
  const isLoggedIn = !!userMetadata

  const userDetails = isLoggedIn ? (
    <>
      <img
        src={userMetadata.userInfo.profileImage}
        alt="profile"
        className="w-12"
      />
      <div className="ml-4">
        <div className="text-sm font-bold">{userMetadata.userInfo.name}</div>
        <button
          onClick={onClick}
          id="logout"
          className="text-sm rounded font-bold px-5 py-1"
          style={{
            background: 'linear-gradient(180deg, #B9CC36 0%, #7FA650 100%)',
          }}
        >
          {userMetadata.publicAddress}
        </button>
      </div>
    </>
  ) : (
    <button
      onClick={onClick}
      id="login"
      className="rect-button w-full mt-5"
      role="link"
    >
      Chess.com Login
    </button>
  )

  return (
    <div className="flex flex-col min-h-screen">
      <header className="relative mb-8">{userDetails}</header>
      <div className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 sm:max-w-screen">
          {children}
        </div>
      </div>
      <>{/*Footer*/}</>
    </div>
  )
}

export default DefaultLayout
