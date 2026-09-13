<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Mail } from '@lucide/vue'
import InputError from '@/components/InputError.vue'
import PasswordInput from '@/components/PasswordInput.vue'
import TextLink from '@/components/TextLink.vue'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import LogInButton from '@/components/LogInButton.vue'
import AuthSplitLayout from '@/layouts/auth/AuthSplitLayout.vue'
import WelcomeModal from '@/components/WelcomeModal.vue'
import { useForm } from '@/lib/form'

defineProps<{
  status?: string
  canResetPassword?: boolean
}>()

const router = useRouter()

const loginForm = useForm({
  email: '',
  password: '',
  remember: false,
})

const goToDashboard = () => {
  // Store user info for the welcome modal
  sessionStorage.setItem('justLoggedIn', 'true')
  sessionStorage.setItem('userEmail', loginForm.data.email as string)
  
  // Show welcome modal, then navigate to dashboard
  showWelcomeModal()
  
  // Navigate after modal has been visible for a bit
  setTimeout(() => {
    router.push('/dashboard')
  }, 3000)
}

// User info for welcome modal
const userName = ref('Beverly Myles')
const userEmail = ref(loginForm.data.email as string)
const showModal = ref(false)

const showWelcomeModal = () => {
  userName.value = 'Beverly Myles'
  userEmail.value = loginForm.data.email as string
  showModal.value = true
}

const submitLogin = async () => {
  if (!loginForm.data.email || !loginForm.data.password) {
    return
  }
  await loginForm.post('/login', {
    onSuccess: goToDashboard,
  })
}
</script>

<template>
  <div>
    <Head title="Log in" />

    <AuthSplitLayout
      title="Log in to your account"
      description="Enter your email and password below to log in"
    >
      <div
        v-if="status"
        class="mb-4 text-center text-sm font-medium text-green-600"
      >
        {{ status }}
      </div>

      <WelcomeModal
        v-if="showModal"
        :name="userName"
        :email="userEmail"
      />

      <form
        @submit.prevent="submitLogin"
        class="flex flex-col gap-6"
      >
        <div class="grid gap-6">
          <div class="grid gap-2">
            <Label for="email">Email address</Label>
            <div class="relative">
              <Mail
                class="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
              />
              <Input
                id="email"
                type="email"
                name="email"
                required
                autofocus
                autocomplete="email"
                placeholder="email@example.com"
                class="pl-10"
                v-model="loginForm.data.email"
              />
            </div>
            <InputError :message="loginForm.errors.email" />
          </div>

          <div class="grid gap-2">
            <div class="flex items-center justify-between">
              <Label for="password">Password</Label>
              <TextLink
                v-if="canResetPassword"
                href="/forgot-password"
                class="text-sm"
              >
                Forgot your password?
              </TextLink>
            </div>
            <PasswordInput
              id="password"
              name="password"
              required
              autocomplete="current-password"
              placeholder="Password"
              v-model="loginForm.data.password"
            />
            <InputError :message="loginForm.errors.password" />
          </div>

          <div class="flex items-center justify-between">
            <Label for="remember" class="flex items-center space-x-3">
              <Checkbox id="remember" name="remember" v-model="loginForm.data.remember" />
              <span>Remember me</span>
            </Label>
          </div>

          <LogInButton
            :loading="loginForm.processing"
            :disabled="loginForm.processing"
            @submit="submitLogin"
          />
        </div>

        <div class="text-muted-foreground text-center text-sm">
          Don't have an account?
          <TextLink href="/register">Sign up</TextLink>
        </div>
      </form>
    </AuthSplitLayout>
  </div>
</template>
