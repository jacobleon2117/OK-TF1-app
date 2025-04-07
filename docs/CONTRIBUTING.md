# Branch Workflow

## Branches
- `feature/auth` - Current branch
- `FS/testing` - Full stack testing branch
- `ARVR/testing` - AR/VR testing branch
- `dev` - Final integration branch (don't push here yet)
- `main` - Production branch (don't push here)

## Steps
1. Work in feature branch:
   ```bash
   git checkout feature/dashboard-scheduling
   # Make changes
   git add .
   git commit -m "Clear message"
   git push origin feature/dashboard-scheduling
   ```

2. Push to testing branch:
   ```bash
   git checkout FS/testing
   git pull origin FS/testing
   git merge feature/dashboard-scheduling
   git push origin FS/testing
   ```

3. **DO NOT push to `dev` until all features are tested and reviewed**

## Code Review
- Get a team member to review your code
- All features must be tested in testing branch
- Update the CHANGELOG.md with your changes

## Code Documentation
Add clear comments to your code:

```typescript
/**
 * Brief description of function
 * @param {Type} param - Description
 * @returns {Type} Description
 */
```