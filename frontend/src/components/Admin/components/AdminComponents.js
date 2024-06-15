// Function to handle logout with a SweetAlert confirmation
function handleLogout() {
    Swal.fire({
        icon: "success",
        title: "Logout",
        text: "Your account has been logged out.",
        confirmButtonText: "OK", // Button text to confirm
    }).then(() => {
        // Remove the token from localStorage after the alert is acknowledged
        localStorage.removeItem('token');
        window.location.href = '../../Auth/Login.html';
    });
}

// Define the Sidebar Component
class SideBar extends HTMLElement {
    connectedCallback() {
        //img logo
        this.innerHTML = `
            <nav class="bg-blue-600 text-white w-full lg:w-full md:w-full h-full p-6">
                <div class="flex items-center justify-between mb-8">
                    <div class="text-lg font-bold">Dashboard</div>
                    <img src="../../../../public/assets/images/finalLogo1.png" alt="Logo" class="w-10 h-10 rounded-full bg-white px-1 py-2" style="margin-right:-14px">
                </div>
                <ul class="space-y-4 md:space-y-5 lg:space-y-6 mt-16">
                    <li class="flex items-center space-x-2">
                        <i class="fas fa-users text-white"></i>
                        <a href="../UserAccounts/UserAccountsList.html" class="hover:text-blue-300">User Accounts List</a>
                    </li>
                    <li class="flex items-center space-x-2">
                        <i class="fas fa-envelope text-white"></i>
                        <a href="../Customer/UsersRequestList.html" class="hover:text-blue-300">User Requests List</a>
                    </li>
                    <li class="flex items-center space-x-2">
                        <i class="fas fa-plus text-white"></i>
                        <a href="../Services/ServiceAdd.html" class="hover:text-blue-300">Add New Services</a>
                    </li>
                    <li class="flex items-center space-x-2">
                        <i class="fas fa-list text-white"></i>
                        <a href="../Services/ServicesList.html" class="hover:text-blue-300">Services List</a>
                    </li>
                </ul>
            </nav>
        `;
    }
}

// Define the Header Component
class Header extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <header>
        <nav class="bg-white border-gray-200 px-4 lg:px-6 py-2.5">
            <div class="max-w-screen-xl mx-auto flex justify-between items-center">
                <div class="hidden lg:flex lg:space-x-8">
                    <ul class="flex flex-col lg:flex-row font-medium">
                        <li>
                            <a href="#" class="font-bold">Digital Solutions: 
                                <span class="font-semibold">Helps in growing the businesses</span>
                            </a>
                        </li>
                    </ul>
                </div>
                <a href="#" class="text-white bg-blue-500 py-1 px-2 rounded-md" id="logoutButton">Log Out</a> <!-- ID for the logout button -->
            </div>
        </nav>    
        </header>
        `;

        // Attach the event listener for the logout button
        this.querySelector('#logoutButton').addEventListener('click', handleLogout); // Call handleLogout on click
    }
}

// Register custom elements
customElements.define('admin-header', Header);
customElements.define('admin-sidebar', SideBar);