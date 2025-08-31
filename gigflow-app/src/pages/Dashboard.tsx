import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../store/app';
import { useGigFlowData, useWallet } from '../hooks/useContracts';

export default function Dashboard() {
  const { session, profile, myPostedGigs, myAssignedGigs, notifications } = useAppStore();
  const { address, balance, isConnected } = useWallet();
  const { profile: contractProfile, userGigs, freelancerGigs } = useGigFlowData();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'posted' | 'assigned'>('overview');
  
  const unreadNotifications = notifications.filter(n => !n.read).length;
  
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Header with Stats */}
      <div className="grid md:grid-cols-5 gap-6">
        
        {/* Wallet Info */}
        <div className="pixel-card p-6 text-center bg-gradient-to-b from-blue-900/20 to-blue-800/10">
          <div className="text-2xl font-bold text-blue-400">{balance} AVAX</div>
          <div className="text-sm text-gray-400">Wallet Balance</div>
          <div className="text-xs text-gray-500 mt-1">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </div>
        </div>
        
        {/* Reputation Score */}
        <div className="pixel-card p-6 text-center bg-gradient-to-b from-purple-900/20 to-purple-800/10">
          <div className="text-2xl font-bold text-purple-400">{profile.reputationScore}</div>
          <div className="text-sm text-gray-400">Reputation NFTs</div>
          <div className="text-xs text-gray-500 mt-1">On-chain verified</div>
        </div>
        
        {/* Active Gigs */}
        <div className="pixel-card p-6 text-center bg-gradient-to-b from-green-900/20 to-green-800/10">
          <div className="text-2xl font-bold text-green-400">{myPostedGigs.length + myAssignedGigs.length}</div>
          <div className="text-sm text-gray-400">Active Projects</div>
          <div className="text-xs text-gray-500 mt-1">
            {myPostedGigs.length} posted, {myAssignedGigs.length} assigned
          </div>
        </div>
        
        {/* Subscription Status */}
        <div className="pixel-card p-6 text-center bg-gradient-to-b from-yellow-900/20 to-yellow-800/10">
          <div className="text-2xl font-bold text-yellow-400">{profile.tier}</div>
          <div className="text-sm text-gray-400">Membership</div>
          <div className="text-xs text-gray-500 mt-1">
            {profile.tier === 'FREE' ? 'Limited features' : 'Full access'}
          </div>
        </div>
        
        {/* Notifications */}
        <div className="pixel-card p-6 text-center bg-gradient-to-b from-red-900/20 to-red-800/10">
          <div className="text-2xl font-bold text-red-400">{unreadNotifications}</div>
          <div className="text-sm text-gray-400">New Updates</div>
          <div className="text-xs text-gray-500 mt-1">
            {notifications.length} total notifications
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="pixel-card p-6">
        <h3 className="text-xl font-bold text-accent-red mb-4">Quick Actions</h3>
        <div className="grid md:grid-cols-4 gap-4">
          <Link 
            to="/gigs/new" 
            className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-center hover:opacity-90 transition-opacity"
          >
            <div className="text-2xl mb-2">🚀</div>
            <div className="font-semibold">Post New Gig</div>
            <div className="text-xs opacity-80">Create project on Avalanche</div>
          </Link>
          
          <Link 
            to="/gigs" 
            className="p-4 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg text-center hover:opacity-90 transition-opacity"
          >
            <div className="text-2xl mb-2">🔍</div>
            <div className="font-semibold">Browse Gigs</div>
            <div className="text-xs opacity-80">Find work opportunities</div>
          </Link>
          
          <Link 
            to="/profile" 
            className="p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-center hover:opacity-90 transition-opacity"
          >
            <div className="text-2xl mb-2">👤</div>
            <div className="font-semibold">Update Profile</div>
            <div className="text-xs opacity-80">Manage your presence</div>
          </Link>
          
          <button 
            onClick={() => window.open('https://avacloud.io', '_blank')}
            className="p-4 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg text-center hover:opacity-90 transition-opacity"
          >
            <div className="text-2xl mb-2">☁️</div>
            <div className="font-semibold">AvaCloud</div>
            <div className="text-xs opacity-80">Decentralized storage</div>
          </button>
        </div>
      </div>

      {/* Tabbed Content */}
      <div className="pixel-card p-6">
        
        {/* Tab Headers */}
        <div className="flex space-x-1 mb-6 bg-gray-800 p-1 rounded-lg">
          {(['overview', 'posted', 'assigned'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 px-4 rounded-md font-semibold transition-colors ${
                activeTab === tab
                  ? 'bg-accent-red text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} Gigs
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Recent Posted Gigs */}
              <div>
                <h4 className="font-bold text-lg mb-3 text-blue-400">Recently Posted</h4>
                {myPostedGigs.slice(0, 3).length > 0 ? (
                  <div className="space-y-3">
                    {myPostedGigs.slice(0, 3).map((gig) => (
                      <div key={gig.id} className="p-3 bg-gray-800/50 rounded-lg">
                        <h5 className="font-semibold text-sm">{gig.title}</h5>
                        <p className="text-xs text-gray-400">{gig.budget} AVAX • {gig.isActive ? 'Active' : 'Completed'}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-2">📝</div>
                    <p>No gigs posted yet</p>
                    <Link to="/gigs/new" className="text-accent-red hover:underline text-sm">
                      Post your first gig
                    </Link>
                  </div>
                )}
              </div>

              {/* Recent Assigned Gigs */}
              <div>
                <h4 className="font-bold text-lg mb-3 text-green-400">Currently Working On</h4>
                {myAssignedGigs.slice(0, 3).length > 0 ? (
                  <div className="space-y-3">
                    {myAssignedGigs.slice(0, 3).map((gig) => (
                      <div key={gig.id} className="p-3 bg-gray-800/50 rounded-lg">
                        <h5 className="font-semibold text-sm">{gig.title}</h5>
                        <p className="text-xs text-gray-400">{gig.budget} AVAX • Client: {gig.client.slice(0, 8)}...</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-2">💼</div>
                    <p>No active assignments</p>
                    <Link to="/gigs" className="text-accent-red hover:underline text-sm">
                      Browse available gigs
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Notifications */}
            <div>
              <h4 className="font-bold text-lg mb-3 text-purple-400">Recent Activity</h4>
              {notifications.slice(0, 5).length > 0 ? (
                <div className="space-y-2">
                  {notifications.slice(0, 5).map((notification) => (
                    <div key={notification.id} className={`p-3 rounded-lg ${notification.read ? 'bg-gray-800/30' : 'bg-blue-900/20 border border-blue-500'}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-semibold text-sm">{notification.title}</h5>
                          <p className="text-xs text-gray-400 mt-1">{notification.message}</p>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(notification.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">🔔</div>
                  <p>No recent activity</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'posted' && (
          <div>
            <h4 className="font-bold text-lg mb-4">Your Posted Gigs</h4>
            {myPostedGigs.length > 0 ? (
              <div className="grid gap-4">
                {myPostedGigs.map((gig) => (
                  <div key={gig.id} className="p-4 bg-gray-800/50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-semibold">{gig.title}</h5>
                        <p className="text-sm text-gray-400">Budget: {gig.budget} AVAX</p>
                        <p className="text-xs text-gray-500">
                          Posted: {new Date(gig.createdAt * 1000).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 text-xs rounded ${
                          gig.isActive ? 'bg-green-900 text-green-400' : 'bg-gray-700 text-gray-400'
                        }`}>
                          {gig.isActive ? 'Active' : 'Completed'}
                        </span>
                        {gig.assignedTo && (
                          <p className="text-xs text-gray-500 mt-1">
                            Assigned to: {gig.assignedTo.slice(0, 8)}...
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📋</div>
                <p className="text-xl text-gray-400 mb-2">No gigs posted yet</p>
                <p className="text-gray-500 mb-4">Start by posting your first project</p>
                <Link 
                  to="/gigs/new" 
                  className="inline-block px-6 py-3 bg-accent-red rounded-lg font-semibold hover:opacity-90"
                >
                  Post Your First Gig
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === 'assigned' && (
          <div>
            <h4 className="font-bold text-lg mb-4">Your Assigned Gigs</h4>
            {myAssignedGigs.length > 0 ? (
              <div className="grid gap-4">
                {myAssignedGigs.map((gig) => (
                  <div key={gig.id} className="p-4 bg-gray-800/50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-semibold">{gig.title}</h5>
                        <p className="text-sm text-gray-400">Budget: {gig.budget} AVAX</p>
                        <p className="text-xs text-gray-500">
                          Client: {gig.client.slice(0, 8)}...
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 text-xs rounded ${
                          gig.isActive ? 'bg-blue-900 text-blue-400' : 'bg-gray-700 text-gray-400'
                        }`}>
                          {gig.isActive ? 'In Progress' : 'Completed'}
                        </span>
                        <Link 
                          to={`/gigs/${gig.id}`}
                          className="block text-xs text-accent-red hover:underline mt-1"
                        >
                          Manage Project
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">💼</div>
                <p className="text-xl text-gray-400 mb-2">No assigned gigs yet</p>
                <p className="text-gray-500 mb-4">Browse available projects to get started</p>
                <Link 
                  to="/gigs" 
                  className="inline-block px-6 py-3 bg-accent-red rounded-lg font-semibold hover:opacity-90"
                >
                  Browse Available Gigs
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
