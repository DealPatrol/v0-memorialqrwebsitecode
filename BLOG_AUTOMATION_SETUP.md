# Blog Automation Setup Guide

This guide explains how to set up automated blog post distribution across social media, email newsletters, and RSS feeds.

## Features Implemented

### 1. RSS Feed
**What it does:** Provides an RSS feed that third-party services can subscribe to for automatic blog updates.

**Access URL:** `https://memorialqr.com/feed.xml`

**How to use:**
- Submit your RSS feed to RSS directories like Feedly, Feedburner, etc.
- Share the feed URL with readers who want to subscribe via RSS readers

### 2. Zapier Social Media Automation
**What it does:** Automatically posts new blog articles to Twitter, Facebook, and LinkedIn when published.

**Setup Steps:**

1. **Get Your Zapier Webhook URL:**
   - Go to [zapier.com](https://zapier.com) and create an account
   - Create a new Zap with these triggers:
     - Trigger: Webhooks by Zapier → Catch Hook
     - Copy the webhook URL provided

2. **Add to Environment Variables:**
   - Go to your Vercel project settings
   - Add environment variable: `ZAPIER_WEBHOOK_URL` = [your webhook URL]

3. **Configure Zap Actions:**
   - **Action 1:** Twitter - Create Tweet
     - Text: `{{title}} {{url}} #MemorialQR #DigitalMemorials`
   - **Action 2:** Facebook - Create Page Post
     - Message: `{{title}}\n\n{{excerpt}}\n\nRead more: {{url}}`
   - **Action 3:** LinkedIn - Share Update
     - Content: `{{title}}\n\n{{excerpt}}\n\n{{url}}`

4. **Test the Webhook:**
   ```bash
   curl -X POST https://memorialqr.com/api/webhooks/blog-published \
     -H "Content-Type: application/json" \
     -d '{
       "slug": "complete-guide-to-memorial-qr-codes",
       "title": "The Complete Guide to Memorial QR Codes",
       "excerpt": "Discover how QR code memorials are revolutionizing...",
       "url": "https://memorialqr.com/blog/complete-guide-to-memorial-qr-codes"
     }'
   ```

### 3. Email Newsletter System
**What it does:** Automatically sends new blog posts to email subscribers.

**Setup:**

1. **Create Newsletter Table:**
   - Run the SQL script: `scripts/create-newsletter-table.sql`
   - This creates the `newsletter_subscribers` table in Supabase

2. **Newsletter Subscription:**
   - Users can subscribe via the form at the bottom of your blog page
   - Subscription confirmation email is sent automatically

3. **Send Newsletter for New Post:**
   ```bash
   curl -X POST https://memorialqr.com/api/newsletter/send \
     -H "Content-Type: application/json" \
     -d '{
       "slug": "complete-guide-to-memorial-qr-codes",
       "title": "The Complete Guide to Memorial QR Codes",
       "excerpt": "Discover how QR code memorials...",
       "imageUrl": "https://memorialqr.com/images/92623621-9554-4f8b-a5be.jpeg"
     }'
   ```

4. **View Subscribers:**
   - Go to Supabase Dashboard → Table Editor → `newsletter_subscribers`

### 4. Improved Blog SEO
**What was added:**
- Article structured data (Schema.org BlogPosting)
- Enhanced metadata with keywords for each post
- Open Graph tags for social sharing
- Twitter Card support
- Canonical URLs
- RSS feed auto-discovery link

## How to Publish a New Blog Post

### Manual Process (Current):

1. **Add blog post to `lib/blog-posts.ts`:**
   ```typescript
   {
     slug: "new-blog-post",
     title: "Your Blog Title",
     excerpt: "Brief description...",
     category: "Guides",
     author: "Your Name",
     date: "2025-01-03",
     readTime: "5 min read",
     image: "/images/your-image.jpeg",
     featured: false,
   }
   ```

2. **Add full content to `app/blog/[slug]/page.tsx`** in the `blogPostsContent` object

3. **Trigger social media sharing:**
   ```bash
   curl -X POST https://memorialqr.com/api/webhooks/blog-published \
     -H "Content-Type: application/json" \
     -d '{
       "slug": "new-blog-post",
       "title": "Your Blog Title",
       "excerpt": "Brief description...",
       "url": "https://memorialqr.com/blog/new-blog-post"
     }'
   ```

4. **Send to newsletter subscribers:**
   ```bash
   curl -X POST https://memorialqr.com/api/newsletter/send \
     -H "Content-Type: application/json" \
     -d '{
       "slug": "new-blog-post",
       "title": "Your Blog Title",
       "excerpt": "Brief description...",
       "imageUrl": "https://memorialqr.com/images/your-image.jpeg"
     }'
   ```

## Reddit Posting (Manual - Recommended)

**Why Manual?**
Reddit has strict anti-spam rules. Automated posting will get you banned. Instead:

**Best Practices:**
1. Join relevant subreddits (r/GriefSupport, r/CemeteryPreservation, r/Genealogy)
2. Engage genuinely with the community first
3. Follow the 90/10 rule: 90% engagement, 10% self-promotion
4. Share your blog posts occasionally with context
5. Add value to discussions, don't just drop links

**Posting Template:**
```
Title: [Helpful Guide] How Memorial QR Codes Work

Hey everyone, I wrote a guide about using QR codes for cemetery memorials. 
It covers [key topics]. Hope this helps anyone looking for digital memorial options.

[Link to your blog post]

Happy to answer any questions!
```

## Analytics & Tracking

**Monitor Performance:**
- RSS feed subscribers via Feedly analytics
- Social media engagement in Zapier dashboard
- Newsletter open rates in Resend dashboard
- Blog traffic in Vercel Analytics

## Environment Variables Checklist

Make sure these are set in Vercel:
- ✅ `RESEND_API_KEY` - For sending emails
- ✅ `RESEND_FROM_EMAIL` - Your from email address
- ✅ `ADMIN_EMAIL` - Your admin email
- ✅ `NEXT_PUBLIC_SITE_URL` - Your site URL
- ⚠️ `ZAPIER_WEBHOOK_URL` - Add this for social automation

## Troubleshooting

**Newsletter subscriptions not working:**
- Check if `newsletter_subscribers` table exists in Supabase
- Verify RLS policies are set correctly
- Check Resend API key is valid

**Social media posts not appearing:**
- Verify Zapier webhook URL is correct
- Check Zap is turned ON in Zapier dashboard
- Test webhook manually with curl command

**RSS feed not updating:**
- Clear your CDN cache
- RSS feeds typically update every 1-4 hours
- Check feed validator: https://validator.w3.org/feed/

## Support

For issues, check:
1. Vercel deployment logs
2. Supabase logs
3. Resend dashboard
4. Zapier task history
