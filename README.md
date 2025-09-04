# Gramin Mart 🏪🌾

A modern digital marketplace platform designed to connect rural farmers and local retailers with customers, bridging the gap between rural producers and urban consumers while empowering local communities.

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Development](#development)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

## 🌟 About

Gramin Mart is a comprehensive e-commerce platform that focuses on rural-urban commerce integration. The platform enables:

- **Farmers** to directly sell their agricultural produce
- **Local retailers** to expand their market reach
- **Customers** to access fresh, locally-sourced products
- **Communities** to benefit from sustainable economic growth

The name "Gramin" derives from the Hindi word for "rural" or "village," reflecting our commitment to empowering rural communities through digital commerce.

## ✨ Features

### 🌾 For Farmers & Producers
- **Direct Sales Platform**: Sell agricultural produce without intermediaries
- **Price Discovery**: Real-time market prices and trends
- **Inventory Management**: Track stock levels and manage listings
- **Quality Certification**: Upload certificates and quality standards
- **Logistics Support**: Integrated shipping and delivery options

### 🏪 For Retailers
- **Multi-vendor Marketplace**: Create and manage online storefronts
- **Product Catalog Management**: Easy-to-use product listing tools
- **Order Management**: Streamlined order processing and fulfillment
- **Customer Analytics**: Insights into customer behavior and preferences
- **Payment Integration**: Secure payment processing

### 🛒 For Customers
- **Local Product Discovery**: Find products from nearby farmers and retailers
- **Fresh Produce Guarantee**: Quality assurance for agricultural products
- **Flexible Delivery Options**: Multiple delivery and pickup options
- **Secure Payments**: Multiple payment methods including digital wallets
- **Order Tracking**: Real-time order status updates

### 📱 Platform Features
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Multi-language Support**: Localized content for different regions
- **Search & Filtering**: Advanced search with multiple filter options
- **Review System**: Customer reviews and ratings
- **Wishlist & Favorites**: Save products for later purchase
- **Notifications**: Real-time updates on orders and promotions

## 🛠 Technology Stack

### Frontend
- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Type-safe development experience
- **Vite**: Lightning-fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **shadcn/ui**: High-quality, accessible React component library

### Development Tools
- **ESLint**: Code linting and quality assurance
- **Prettier**: Code formatting
- **Husky**: Git hooks for code quality
- **PostCSS**: CSS processing and optimization

### Architecture
- **Component-based Architecture**: Modular and reusable UI components
- **Responsive Design**: Mobile-first approach
- **Progressive Web App (PWA)**: Offline capabilities and app-like experience
- **SEO Optimized**: Search engine friendly structure

## 🚀 Getting Started

### Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js**: Version 16.0 or higher
- **npm**: Version 7.0 or higher (comes with Node.js)
- **Git**: For version control

You can verify your installations by running:
```bash
node --version
npm --version
git --version
```

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/naakaarafr/gramin-mart.git
   cd gramin-mart
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` and add your environment-specific variables:
   ```env
   VITE_API_BASE_URL=your_api_base_url
   VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```

### Development

1. **Start the development server**
   ```bash
   npm run dev
   ```

2. **Open your browser**
   Navigate to `http://localhost:5173` to see the application running.

3. **Build for production**
   ```bash
   npm run build
   ```

4. **Preview production build**
   ```bash
   npm run preview
   ```

## 📁 Project Structure

```
gramin-mart/
├── public/                 # Static assets
│   ├── icons/             # App icons and favicons
│   ├── images/            # Static images
│   └── manifest.json      # PWA manifest
├── src/                   # Source code
│   ├── components/        # Reusable UI components
│   │   ├── ui/           # Base UI components (shadcn/ui)
│   │   ├── layout/       # Layout components
│   │   ├── forms/        # Form components
│   │   └── common/       # Common/shared components
│   ├── pages/            # Page components
│   │   ├── home/         # Homepage
│   │   ├── products/     # Product pages
│   │   ├── auth/         # Authentication pages
│   │   └── dashboard/    # User dashboards
│   ├── hooks/            # Custom React hooks
│   ├── services/         # API services and external integrations
│   ├── utils/            # Utility functions
│   ├── types/            # TypeScript type definitions
│   ├── styles/           # Global styles and Tailwind config
│   ├── constants/        # Application constants
│   ├── context/          # React context providers
│   └── main.tsx          # Application entry point
├── tests/                # Test files
├── docs/                 # Documentation
├── .env.example          # Environment variables template
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── vite.config.ts        # Vite configuration
└── README.md            # This file
```

## 📖 Usage

### For Farmers/Producers

1. **Registration**: Create an account as a producer
2. **Profile Setup**: Complete your farmer/producer profile with certifications
3. **Product Listing**: Add your agricultural products with descriptions, prices, and images
4. **Inventory Management**: Keep track of available stock and update quantities
5. **Order Processing**: Manage incoming orders and coordinate deliveries

### For Retailers

1. **Store Setup**: Create your digital storefront
2. **Product Catalog**: Build your product inventory
3. **Customer Management**: Handle customer inquiries and support
4. **Analytics**: Monitor sales performance and customer trends
5. **Promotions**: Create discounts and special offers

### For Customers

1. **Browse Fresh Produce**: Explore seasonal fruits, vegetables, and farm products
2. **Select Your Farm**: Choose products from specific local farms
3. **Add to Cart**: Build your fresh produce order
4. **Secure Checkout**: Complete purchases with various payment options
5. **Track Freshness**: Monitor delivery status and expected freshness upon arrival

## 🔌 API Documentation

### Base URL
```
https://api.graminmart.com/v1
```

### Authentication
The API uses JWT token-based authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Key Endpoints

#### Products
- `GET /products` - Get all products with pagination
- `GET /products/:id` - Get specific product details
- `POST /products` - Create new product (producers only)
- `PUT /products/:id` - Update product (owner only)
- `DELETE /products/:id` - Delete product (owner only)

#### Users
- `POST /auth/register` - User registration
- `POST /auth/login` - User authentication
- `GET /users/profile` - Get user profile
- `PUT /users/profile` - Update user profile

#### Orders
- `GET /orders` - Get user orders
- `POST /orders` - Create new order
- `GET /orders/:id` - Get specific order details
- `PUT /orders/:id/status` - Update order status

For complete API documentation, visit `/api-docs` when running the development server.

## 🌐 Deployment

### Using Lovable Platform (Recommended)

This project is optimized for deployment using Lovable:

1. **Visit the Lovable Project**: [Gramin Mart on Lovable](https://lovable.dev/projects/109e86ed-c288-4cad-9667-4661a5800a42)
2. **Click Share → Publish** to deploy instantly
3. **Custom Domain**: Navigate to Project > Settings > Domains to connect your domain

### Manual Deployment

#### Vercel
```bash
npm install -g vercel
vercel
```

#### Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
```

#### Traditional Hosting
```bash
npm run build
# Upload dist/ folder to your hosting provider
```

### Environment Variables for Production

Ensure the following environment variables are set in your production environment:
- `VITE_API_BASE_URL`
- `VITE_STRIPE_PUBLIC_KEY`
- `VITE_GOOGLE_MAPS_API_KEY`
- `VITE_ANALYTICS_ID`

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Getting Started
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm test`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Development Guidelines
- Follow the existing code style and conventions
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure responsive design principles

### Code Style
- Use TypeScript for type safety
- Follow React best practices and hooks patterns
- Use Tailwind CSS for styling
- Maintain component modularity and reusability

### Reporting Issues
- Use GitHub Issues to report bugs or request features
- Provide detailed descriptions and reproduction steps
- Include screenshots for UI-related issues

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation
- [Getting Started Guide](docs/getting-started.md)
- [API Documentation](docs/api.md)
- [Deployment Guide](docs/deployment.md)
- [Contributing Guidelines](docs/contributing.md)

### Community
- **GitHub Issues**: [Report bugs or request features](https://github.com/naakaarafr/gramin-mart/issues)
- **Discussions**: [Join community discussions](https://github.com/naakaarafr/gramin-mart/discussions)
- **Email**: support@graminmart.com

### Development Support
- **Lovable Platform**: [Project Dashboard](https://lovable.dev/projects/109e86ed-c288-4cad-9667-4661a5800a42)
- **Custom Domain Setup**: [Domain Configuration Guide](https://docs.lovable.dev/tips-tricks/custom-domain)

---

## 🙏 Acknowledgments

- Thanks to all contributors who have helped build this platform
- Special recognition to rural communities and farmers who inspired this project
- Built with love for empowering local commerce and sustainable agriculture

---

**Made with ❤️ for rural communities by [Gramin Mart Team](https://github.com/naakaarafr)**
