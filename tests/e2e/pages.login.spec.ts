import { test, expect } from '@playwright/test'
import readline from 'readline'
function ask(question: string): Promise<string> {
  console.log(question) // 确认打印出提示信息
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      console.log('收到输入: ', answer) // 调试信息
      rl.close()
      resolve(answer)
    })
  })
}
test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    // 导航到登录页面
    await page.goto('/login')
  })

  const selector = {
    username: 'input[prop="username"]',
    password: 'input[prop="password"]',
    login_button: 'button[prop="submit"]',
  }

  test('Auth001', async ({ page }) => {
    await page.fill(selector.username, 'admin')
    await page.fill(selector.password, 'admin123')

    // 读取控制台输入（如验证码）
    const captcha = await ask('请输入验证码: ')
    console.log('验证码:', captcha)
    // 假设页面中有一个输入框用于验证码
    await page.fill('input[prop="captcha"]', captcha)

    await page.click(selector.login_button)
    await expect(page).toHaveURL('/dashboard')
  })
})
