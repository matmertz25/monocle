import MainLayout from '../layout/Main'

export default function Settings() {
  return (
    <MainLayout>
      <main className="max-w-lg mx-auto pt-10 pb-12 px-4 lg:pb-16">
        <form>
          <div className="space-y-6">
            <div>
              <h1 className="text-lg leading-6 font-medium text-gray-900">Settings</h1>
              <p className="mt-1 text-sm text-gray-500">
                Configure settings for Monocle and connecting to the Swarm network
              </p>
            </div>

            <div>
              <label htmlFor="project-name" className="block text-sm font-medium text-gray-700">
                Bee Node Url
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="project-name"
                  id="project-name"
                  className="block w-full shadow-sm focus:ring-sky-500 focus:border-sky-500 sm:text-sm border-gray-300 rounded-md"
                  defaultValue="https://bee-1.gateway.ethswarm.org"
                />
              </div>
            </div>
          </div>
        </form>
      </main>
    </MainLayout>
  )
}
