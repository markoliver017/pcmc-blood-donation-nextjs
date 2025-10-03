# FAQ Chatbot Implementation

## Overview
Successfully implemented a floating FAQ chatbot accessible from all public pages using shadcn/ui drawer component.

## Implementation Date
2025-10-03

## Files Created

### 1. `/components/faq/FloatingFAQButton.jsx`
- Main component that renders the floating button
- Uses shadcn/ui `DrawerState` component for controlled state
- Positioned fixed at bottom-right corner (z-index: 50)
- Features:
  - Floating circular button with MessageCircle icon
  - Smooth hover animations (scale effect)
  - Opens drawer from bottom with FAQ chat interface
  - Responsive design with dark mode support

### 2. `/components/faq/ChatDrawer.jsx`
- Optimized chat component specifically for drawer usage
- Removed redundant header (drawer has its own)
- Features:
  - Real-time streaming responses from Ollama API
  - Message history with timestamps
  - Auto-scrolling to latest messages
  - Textarea with auto-resize (max 150px)
  - Loading states with spinner
  - Error handling
  - Dark mode support
  - Keyboard shortcuts:
    - Enter: Send message
    - Shift+Enter: New line
    - Cmd/Ctrl+Enter: Send message

## Integration

### Modified Files

#### `/app/(pages)/layout.jsx`
Added the FloatingFAQButton component to the main layout:
```jsx
import FloatingFAQButton from "@components/faq/FloatingFAQButton";

// Inside the return statement, added before closing MainWrapper:
<FloatingFAQButton />
```

This ensures the FAQ chatbot is accessible from:
- Home page (`/`)
- About Us (`/about-us`)
- Why Donate (`/why-donate`)
- Donation Process (`/donation-process`)
- Eligibility Requirements (`/eligibility-requirements`)
- Contact Us (`/contact-us`)
- All other public pages under `(main)` route group

## Features

### User Experience
1. **Floating Button**: Always visible at bottom-right corner
2. **Drawer Interface**: Opens from bottom with smooth animation
3. **Chat Interface**: Clean, modern design with message bubbles
4. **Real-time Responses**: Streaming text from AI model
5. **Responsive**: Works on all screen sizes
6. **Accessible**: Proper ARIA labels and keyboard navigation

### Technical Features
1. **Server-Side FAQ Search**: Uses `/api/faq-chat` endpoint
2. **Context-Aware**: Searches FAQs based on user query
3. **Streaming API**: Real-time response streaming from Ollama
4. **State Management**: Controlled drawer state with React hooks
5. **Dark Mode**: Full support for light/dark themes
6. **Error Handling**: Graceful error messages

## API Endpoint

### `/app/api/faq-chat/route.js`
- **Method**: POST
- **Payload**: 
  ```json
  {
    "message": "user question",
    "history": [{"role": "user", "content": "..."}]
  }
  ```
- **Response**: Streaming text response
- **Features**:
  - Searches FAQs using `searchFAQs()` utility
  - Formats context using `formatFAQsForContext()`
  - Calls Ollama API with streaming enabled
  - Returns canned response if no relevant FAQs found

## Dependencies

### Existing Components Used
- `@components/ui/button` - shadcn/ui Button
- `@components/ui/drawer` - shadcn/ui Drawer (DrawerState variant)
- `lucide-react` - Icons (MessageCircle, X, Bot, User, Loader2, Send)

### Utilities
- `@lib/utils/faq.utils` - FAQ search and formatting
- `@/action/faqAction` - Server action to fetch FAQs

## Styling

### Tailwind Classes
- Fixed positioning: `fixed bottom-6 right-6`
- Z-index: `z-50` (above most content)
- Animations: `transition-all duration-300 hover:scale-110`
- Drawer height: `h-[90vh] max-h-[90vh]`
- Responsive text sizing
- Dark mode variants throughout

## Usage

Users can:
1. Click the floating blue button at bottom-right
2. Type questions about blood donation
3. Receive AI-powered responses based on FAQ database
4. View conversation history
5. Close drawer by clicking X or clicking outside

## Future Enhancements

Potential improvements:
1. Add conversation persistence (localStorage)
2. Add suggested questions/quick replies
3. Add typing indicators
4. Add conversation export feature
5. Add feedback mechanism (thumbs up/down)
6. Add analytics tracking
7. Add multilingual support

## Notes

- Requires Ollama API to be running (default: http://localhost:11434)
- Uses Llama2 model by default (configurable via env vars)
- FAQ data must be active in database (`is_active: true`)
- Drawer only appears on public pages (not in portal routes)
