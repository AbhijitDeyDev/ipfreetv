# IPFreeTV Project - AI Context File

## Project Overview
IPFreeTV is a NativeScript-based IPTV application for Android (with iOS support not yet tested) that provides access to over 300+ Indian TV channels. The app features a clean, modern interface with tabbed navigation, channel categorization, favorites management, and video streaming capabilities.

## Technology Stack
- **Framework**: NativeScript Core (`@nativescript/core`) v9.x
- **Video Player**: `@nstudio/nativescript-exoplayer` for Android ExoPlayer integration
- **UI Components**: 
  - `@nativescript-community/ui-material-ripple` for material design ripple effects
  - `@nativescript-community/ui-image` for optimized image handling
  - `@nativescript-community/ui-collectionview` for performant list rendering
- **Styling**: TailwindCSS v4.x with custom CSS variables
- **Development**: TypeScript 5.8.x with NativeScript Webpack

## Project Structure
```
ipfreetv/
├── app/                          # Application source code
│   ├── assets/                   # Static assets
│   │   ├── icons/                # Application icons (PNG format)
│   │   ├── images/               # Images and screenshots
│   │   └── json/                 # Data files
│   │       └── IndianChannels.json  # 822+ channel entries with streaming URLs
│   ├── common/                   # Shared utilities and constants
│   │   ├── constant.ts           # Storage keys and GitHub details
│   │   ├── helpers.ts            # Utility functions (app version, semver comparison)
│   │   └── store/                # State management (favorites storage)
│   ├── components/               # Reusable UI components
│   │   ├── action-bar/           # Custom action bar with search functionality
│   │   │   ├── action-bar.xml    # XML layout
│   │   │   └── action-bar.ts     # TypeScript logic
│   │   └── channel-list/         # Channel listing component
│   ├── screens/                  # Application screens
│   │   ├── main-page.ts          # Main tabbed navigation entry point
│   │   ├── category-page/        # Channel categories listing
│   │   ├── channel-by-category-page/ # Channels filtered by category
│   │   ├── all-channel-page/     # Complete channels list
│   │   ├── favorite-page/       # User's favorite channels
│   │   ├── video-page/           # Video playback screen with ExoPlayer
│   │   └── about-page/           # About/Info screen
│   ├── app.ts                    # Application entry point, initializes UI image library
│   ├── app.css                   # Global styles with Tailwind and custom variables
│   ├── app-root.xml              # Root frame navigation
│   └── references.d.ts           # TypeScript type references
├── App_Resources/                # Platform-specific resources (Android/iOS)
├── hooks/                        # NativeScript build hooks
├── metadata/                     # App store metadata and screenshots
├── platforms/                    # Platform build outputs
├── node_modules/                 # Dependencies
└── Configuration files:
    ├── package.json              # Dependencies and project metadata
    ├── nativescript.config.ts    # NativeScript configuration
    ├── tsconfig.json             # TypeScript configuration
    ├── webpack.config.js         # Webpack build configuration
    ├── .gitignore                # Git ignore rules
    └── AndroidKey.jks            # Android signing key (if applicable)
```

## Key Features & Implementation Details

### 1. Navigation Architecture
- **TabView**: Main navigation with 3 tabs: Categories, Favorites, All Channels
- **Frame Navigation**: Each tab contains a Frame that loads respective screens
- **Context Passing**: Navigation between screens passes data via context parameter

### amplification for Android and iOS</mark>:</strong> Platform-specific code using `__ANDROID__` and `__IOS__` macros
- **Screen Orientation**: Portrait by default, landscape for fullscreen video
- **Back Button Handling**: Custom Android back button behavior for video player
- **Fullscreen Mode**: Toggle between portrait and landscape with system UI control

### 3. Data Management
- **Channel Data**: Static JSON file (`IndianChannels.json`) with 822+ entries
- **Channel Structure**: Each entry has `id`, `tvg-logo`, `group-title`, `name`, `url` (m3u8)
- **Favorites Storage**: Uses `ApplicationSettings` with key `favorite_channel_id`
- **Categories**: Derived from `group-title` field (can be multiple categories separated by semicolon)

### 4. UI Components
- **Custom Action Bar**: 
  - Title display with about page navigation
  - Back button visibility control
  - Search toggle with real-time filtering
- **Channel List**: Grid/list view of channels with logos and names
- **Video Player**: Full ExoPlayer integration with controls and fullscreen toggle

### 5. Styling System
-yaml<strong>CSS Variables:</strong> Custom color palette in `app.css`
  - `--primary: #08CB00` (green)
  - `--secondary: #253900` (dark green)
  - `--text: #000000`
  - `--bg: #EEEEEE`
- **TailwindCSS**: Utility-first CSS framework integration
- **Custom Fonts**: Roboto with regular and bold variants

## Important Code Patterns

### 1. ViewModel Creation
```typescript
const viewModel = fromObject({
  items: data,
  onItemTap: (param) => {
    return () => {
      // Navigation logic
    };
  },
  // Other observable properties
});
```

### 2. Screen Orientation Control (Android)
```typescript
if (__ANDROID__) {
  Utils.android.getCurrentActivity()
    .setRequestedOrientation(android.content.pm.ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
}
```

### 3. Fullscreen Video Implementation
```typescript
function toggleFullscreen() {
  if (__ANDROID__) {
    const currentActivity = Utils.android.getCurrentActivity();
    if (newFullscreenState) {
      currentActivity.getWindow().getInsetsController()
        .hide(android.view.WindowInsetsController.BEHAVIOR_DEFAULT);
      currentActivity.setRequestedOrientation(
        android.content.pm.ActivityInfo.SCREEN_ORIENTATION_SENSOR_LANDSCAPE
      );
    }
  }
}
```

### 4. Category Processing
```typescript
function getChannelCategories() {
  const categories: Record<string, number> = {};
  IndianChannels.forEach(({ "group-title": groupTitle }) => {
    const groupTitles = groupTitle.trim().length ? groupTitle.split(';') : ['Others'];
    groupTitles.forEach(gTitle => {
      categories[gTitle] = (categories[gTitle] || 0) + 1;
    });
  });
  return Object.entries(categories).map(([name, count]) => ({ name, count }));
}
```

## Development Notes

### 1. Building and Running
```bash
npm install           # Install dependencies
ns run android       # Run on Android device/emulator
ns run ios           # Run on iOS (not tested currently)
```

### 2. Key Dependencies
- `@nativescript/core`: Core framework
- `@nativescript/android`: Android platform support
- `@nativescript/webpack`: Build tooling
- `@nativescript/tailwind`: TailwindCSS integration

### 3. Data Updates
- Channel data is stored in `app/assets/json/IndianChannels.json`
- To update channels, modify this JSON file and rebuild
- JSON structure: Array of objects with `id`, `tvg-logo`, `group-title`, `name`, `url`

### 4. Styling Updates
- Modify `app/app.css` for global styles and CSS variables
- Use Tailwind classes in XML files for utility styling
- Custom components can have their own CSS if needed

## Maintenance Guidelines

### 1. Adding New Screens
1. Create folder in `app/screens/` with `-page` suffix
2. Create `page-name.xml` (layout) and `page-name.ts` (logic)
3. Update navigation in relevant screens or main navigation

### 2. Adding New Components
1. Create folder in `app/components/`
2. Create `.xml` and `.ts` files
3. Import in screens using `xmlns:prefix="components/component-name"`

### 3. Updating Channel Data
1. Edit `IndianChannels.json`
2. Ensure structure matches existing format
3. Categories are derived from `group-title` field

### 4. Platform-Specific Code
- Use `__ANDROID__` and `__IOS__` macros for platform-specific logic
- Android-specific code in `Utils.android` namespace
- Test both platforms when making changes

## Known Limitations
1. **iOS Support**: Not fully tested (per README)
2. **Channel URLs**: Some streams may be geo-blocked or unstable
3. **Offline Support**: No offline caching of streams
4. **User Accounts**: No cloud sync of favorites

---

**Last Updated**: Project exploration completed on initial analysis  
**Update This File**: When making significant changes to project structure, dependencies, or architecture

**To Update**: 
1. Review the changed areas of the project
2. Update relevant sections in this document
3. Note the date and nature of changes
4. Maintain the same structure for consistency
```
